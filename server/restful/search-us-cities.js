import axios from 'axios';
import htmlParser from 'node-html-parser';

export default async (req, res) => {
  if (!req.user) res.json([]);

  const response = await axios.get(`http://www.transportautoquoter.com/views/metro_city_fetch.php?st=${req.query.state}`);
  const options = htmlParser(response.data).querySelectorAll('option');
  const cities = [];
  options.forEach((option) => {
    if (option.rawAttributes.value > 0) {
      cities.push({
        id: option.rawAttributes.value,
        name: option.text
      });
    }
  });

  res.json(cities);
};
