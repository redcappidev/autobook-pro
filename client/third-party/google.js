import { Client } from '@googlemaps/google-maps-services-js';

/**
 * This gets the latitude and longitude of a location from the given zip code
 * by using Google Map Geocoding API.
 * @param {String} zipcode Zip code
 */
export const getLocationFromZipcode = async (zipcode) => {
  const client = new Client({});
  const response = await client.geocode({
    params: {
      address: zipcode,
      key: window.GOOGLE_MAP_API_KEY_FOR_CLIENT
    }
  });

  if (response.data.status === 'OK') {
    return response.data.results[0].geometry.location;
  }

  return null;
};
