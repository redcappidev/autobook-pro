import axios from 'axios';
import config from '@server/config';

export default async (req, res) => {
  if (!req.user) res.status(401).send();

  const orderId = req.query.order_id;

  const response = await axios.get(`${config.centralDispatch.listingIdApi}?id=${orderId}`);
  const internalId = response.data.result;

  res.json({ data: internalId });
};
