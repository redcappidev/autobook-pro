import { GoogleMap } from '@server/third-party';
import {
  USCity,
  PricingException,
  MileagePricing,
  VehicleSizeChart,
  EnclosedFee,
  Fee
} from '@server/models';
import { calcDistanceBetweenTwoPoints } from '@server/lib/location-helpers';
import { REFERRER_NOT_SELECTED } from '@server/constants/referrers';
import { QUOTE_ENGAGEMENT_FULLPAY } from '@server/constants/quote-engagements';

export const applyExceptionPricingRule = async (
  pricingException,
  quote,
  hint
) => {
  const originCity = await USCity.query().findOne({
    cityName: quote.origin.city,
    stateCode: quote.origin.state
  });
  const destCity = await USCity.query().findOne({
    cityName: quote.destination.city,
    stateCode: quote.destination.state
  });

  let originZipLocation;
  if (hint && hint.originZipLocation) {
    originZipLocation = hint.originZipLocation;
  } else {
    originZipLocation = await GoogleMap.geocodingAPI.getLocationFromZipcode(
      quote.origin.zipcode
    );
  }

  let destZipLocation;
  if (hint && hint.destZipLocation) {
    destZipLocation = hint.destZipLocation;
  } else {
    destZipLocation = await GoogleMap.geocodingAPI.getLocationFromZipcode(
      quote.destination.zipcode
    );
  }

  const originOffset = calcDistanceBetweenTwoPoints(
    originCity.lat,
    originCity.lng,
    originZipLocation.lat,
    originZipLocation.lng
  );
  const destOffset = calcDistanceBetweenTwoPoints(
    destCity.lat,
    destCity.lng,
    destZipLocation.lat,
    destZipLocation.lng
  );

  const radiuses = [];
  [1, 2, 3].forEach((index) => {
    radiuses.push({
      originRadius: pricingException[`originRadius${index}`],
      destRadius: pricingException[`destRadius${index}`],
      price: pricingException[`price${index}`]
    });
  });

  const targetRadius = radiuses
    .sort((a, b) => a.price - b.price)
    .find(
      (radius) =>
        radius.originRadius > originOffset && radius.destRadius > destOffset
    );

  if (targetRadius) return targetRadius.price;
  return 0;
};

export const getEnclosedFee = async (distance, carrierType) => {
  if (carrierType === 'OPEN') return 0;
  if (carrierType !== 'ENCLOSED') return 0;

  const enclosedFee = await EnclosedFee.query()
    .where('minMileage', '<=', distance)
    .where('maxMileage', '>=', distance)
    .first();

  return enclosedFee ? enclosedFee.fee : 0;
};

export const calcQuotePrice = async (quote) => {
  if (global.TESTING) {
    return {
      basePrice: 900,
      sizeFee: 10,
      inopFee: 0,
      enclosedFee: 0,
      deposit: 95,
      fullPay: 0,
      totalPrice: 910 + 10 + 95
    };
  }

  if (quote.origin.zipcode === quote.destination.zipcode) {
    return {
      basePrice: 0,
      sizeFee: 0,
      inopFee: 0,
      enclosedFee: 0,
      deposit: 0,
      fullPay: 0,
      totalPrice: 0
    };
  }

  const originZipLocation = await GoogleMap.geocodingAPI
    .getLocationFromZipcode(quote.origin.zipcode);
  const destZipLocation = await GoogleMap.geocodingAPI
    .getLocationFromZipcode(quote.destination.zipcode);

  let distanceInMiles;
  if (!originZipLocation || !destZipLocation) {
    distanceInMiles = 0;
  } else {
    distanceInMiles = await GoogleMap.directionsAPI.calculateDistance(
      `${originZipLocation.lat},${originZipLocation.lng}`,
      `${destZipLocation.lat},${destZipLocation.lng}`
    );
  }

  const mileagePricing = await MileagePricing.query()
    .where('minMileage', '<=', distanceInMiles)
    .where('maxMileage', '>=', distanceInMiles)
    .first();
  const pricingException = await PricingException.query().findOne({
    originState: quote.origin.state,
    originCity: quote.origin.city,
    destState: quote.destination.state,
    destCity: quote.destination.city
  });
  // Apply the exception rule if exists
  let exceptionPrice = 0;
  if (pricingException) {
    exceptionPrice = await applyExceptionPricingRule(pricingException, quote, {
      originZipLocation,
      destZipLocation
    });
  }

  const promises = quote.vehicles.map((vehicle) =>
    VehicleSizeChart.query()
      .findOne({
        make: vehicle.make,
        model: vehicle.model
      })
      .select('size.rateBump as byRate', 'size.flatBump as byFlat')
      .joinRelated('size')
  );
  const bumps = (await Promise.all(promises)).filter((bump) => bump);

  const basePrice = exceptionPrice || (mileagePricing ? mileagePricing.price : 0);
  let totalPrice = bumps.length > 0 ? 0 : basePrice;
  let sizeFee = 0;
  bumps.forEach((bump) => {
    if (!bump) return;

    let bumpPrice = 0;

    if (bump.byRate) {
      bumpPrice = (basePrice * bump.byRate) / 100;
    }
    if (bump.byFlat) {
      bumpPrice = bump.byFlat;
    }
    totalPrice += basePrice;
    sizeFee += bumpPrice;
  });

  // Apply the pricing rule by size fee.
  totalPrice += sizeFee;

  // Apply the pricing rule by carrier type.
  const { carrierType = 'OPEN' } = quote.transport || {};
  const enclosedFee = await getEnclosedFee(distanceInMiles, carrierType);
  totalPrice += enclosedFee;

  // Apply the pricing rule by inop
  let inopFee = await Fee.query().findOne('slug', 'inop');
  inopFee = inopFee ? inopFee.fee : 0;
  const quoteInopFee = quote.vehicles.reduce((m, v) => m + (v.operable ? 0 : inopFee), 0);
  totalPrice += quoteInopFee;

  // Add the deposit fee.
  const referrer = quote.referrer || REFERRER_NOT_SELECTED;
  let depositFee = await Fee.query().findOne('slug', `${referrer}-deposit`);
  depositFee = depositFee ? depositFee.fee : 0;
  totalPrice += depositFee;

  let fullPay = 0;
  if (quote.engagements && quote.engagements.includes(QUOTE_ENGAGEMENT_FULLPAY)) {
    fullPay = Math.floor(totalPrice * 0.03);
    totalPrice += fullPay;
  }

  return {
    basePrice,
    sizeFee,
    inopFee: quoteInopFee,
    enclosedFee,
    deposit: depositFee,
    fullPay,
    totalPrice
  };
};
