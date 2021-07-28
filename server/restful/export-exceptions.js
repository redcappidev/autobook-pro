import csvStringify from 'csv-stringify';
import { PricingException } from '@server/models';

export default async (req, res) => {
  if (!req.user) res.json();

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="Pricing Exceptions.csv"');

  const exceptions = await PricingException.query();
  csvStringify(exceptions.map(({
    id,
    createdAt,
    updatedAt,
    ...e
  }) => e), { header: true }).pipe(res);
};
