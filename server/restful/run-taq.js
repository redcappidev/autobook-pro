import { taqService } from '@server/services';
import { validateRunTaqPayload } from './validators';

export default async (req, res) => {
  const payload = req.body;

  const validationResult = validateRunTaqPayload(payload);

  if (!validationResult.valid) {
    res.status(400).json({
      code: 400,
      errors: validationResult.errors
    });
  } else {
    const { origin, destination, vehicles, carrierType, referrer } = payload;

    const quote = {
      origin,
      destination,
      vehicles,
      transport: {
        carrierType
      },
      referrer
    };

    const result = await taqService.calcQuotePrice(quote);

    res.json({ estimate: result.totalPrice });
  }
};
