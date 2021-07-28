import { REFERRER_NOT_SELECTED } from '@server/constants/referrers';

/**
 * Some of the quote data might gets coerced to custom scalar types.
 * So we need to unwrap the data in order to check if the data confirms quote schema
 * @param {Object} rawData quote data that is submitted from the client app.
 */
function parse(rawData) {
  return {
    referrer: rawData.referrer || REFERRER_NOT_SELECTED,
    shipper: rawData.shipper,
    origin: rawData.origin,
    destination: rawData.destination,
    vehicles: rawData.vehicles,
    transport: {
      ...rawData.transport,
      carrierType: rawData.transport.carrierType || 'OPEN'
    }
  };
}

export default parse;
