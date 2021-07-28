import axios from 'axios';
import config from '@server/config';

export default async (req, res) => {
  if (!req.user) res.json();

  const { search_type: searchType, search_number: searchNumber } = req.query;
  if (!searchType || !searchNumber) {
    res.status(400).send('INVALID_REQUEST');
    throw new Error('Invalid request');
  }

  try {
    const response = await axios.get(`${config.autobook.carrierDataApi}?search_type=${searchType}&search_number=${searchNumber}`);
    const rawData = response.data;
    const carrierData = {};

    carrierData.mcNumber = rawData.mc_mx_ff_numbers.replace('MC-', '');
    carrierData.dotNumber = rawData.usdot;
    carrierData.companyName = rawData.dba_name;
    carrierData.address = rawData.physical_address;
    carrierData.phoneNumber = rawData.phone;

    res.json(carrierData);
  } catch (error) {
    res.status(404).send('NOT_FOUND');
  }
};
