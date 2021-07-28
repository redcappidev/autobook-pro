import { Client } from '@googlemaps/google-maps-services-js';
import config from '@server/config';

/**
 * This gets the latitude and longitude of a location from the given zip code
 * by using Google Map Geocoding API.
 * @param {String} zipcode Zip code
 */
export const getLocationFromZipcode = async (zipcode) => {
  try {
    const client = new Client({});
    const response = await client.geocode({
      params: {
        address: zipcode,
        key: config.googleMap.apiKeyForServer
      }
    });
    if (response.data.status === 'OK') {
      return response.data.results[0].geometry.location;
    }
  } catch (error) {
    return null;
  }

  return null;
};
