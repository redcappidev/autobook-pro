import { getFormattedPhoneNumber } from '@server/lib/phone-format';
import { REFERRER_IRELO } from '@server/constants/referrers';

function parse(rawData) {
  const quote = {};
  quote.origin = {};
  quote.origin.city = rawData['Origin City'];
  quote.origin.state = rawData['Origin State'];
  quote.origin.zipcode = `${rawData['Origin Zip']}`;
  quote.destination = {};
  quote.destination.city = rawData['Destination City'];
  quote.destination.state = rawData['Destination State'];
  quote.destination.zipcode = `${rawData['Destination Zip']}`;
  quote.vehicles = [
    {
      year: rawData['Vehicle Year'],
      make: rawData['Vehicle Make'],
      model: rawData['Vehicle Model'],
      operable: rawData['Vehicle Condition'] === 'Yes'
    }
  ];
  quote.shipper = {};
  quote.shipper.firstName = rawData['First Name'];
  quote.shipper.lastName = rawData['Last Name'];
  quote.shipper.email = rawData['Customer Email'];
  quote.shipper.phone = getFormattedPhoneNumber(rawData['Customer Phone']);
  quote.transport = {};
  quote.transport.availableDate = new Date(rawData['Move Date']);
  quote.transport.carrierType = 'OPEN';
  quote.referrer = REFERRER_IRELO;

  return quote;
}

export default parse;
