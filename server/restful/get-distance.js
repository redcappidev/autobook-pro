import { GoogleMap } from '@server/third-party';

export default async (req, res) => {
  if (!req.user) res.json([]);

  const { origin, destination } = req.query;
  const originZipLocation = await GoogleMap.geocodingAPI.getLocationFromZipcode(
    origin
  );
  const destZipLocation = await GoogleMap.geocodingAPI.getLocationFromZipcode(
    destination
  );

  if (!originZipLocation || !destZipLocation) {
    res.json(0);
  } else {
    const distanceInMiles = await GoogleMap.directionsAPI.calculateDistance(
      `${originZipLocation.lat},${originZipLocation.lng}`,
      `${destZipLocation.lat},${destZipLocation.lng}`
    );

    res.json(distanceInMiles);
  }
};
