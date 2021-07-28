import { Client } from '@googlemaps/google-maps-services-js';
import config from '@server/config';

/**
 * This calculates the driving distance between origin and destination
 * by using Google Map Directions API.
 * @param {String} origin An address or textual latitude/longitude
 * @param {String} destination An address or textual latitude/longitude
 */
export const calculateDistance = async (origin, destination) => {
  const client = new Client({});

  const response = await client.directions({
    params: {
      origin,
      destination,
      key: config.googleMap.apiKeyForServer
    }
  });
  if (response.data.status === 'OK') {
    // 1 mile = 1609.34 meters
    return Math.floor(response.data.routes[0].legs[0].distance.value / 1609.34);
  }

  return -1;
};
