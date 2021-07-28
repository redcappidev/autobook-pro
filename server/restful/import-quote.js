import { quoteService } from '@server/services';
import { validateWebsiteLeadPayload } from './validators';

export default async (req, res) => {
  const leadSource = req.params.source;
  const payload = req.body;

  let validated = { valid: true };

  if (leadSource === 'website') {
    payload.referrer = 'website';
    validated = validateWebsiteLeadPayload(payload);
  }

  if (!validated.valid) {
    res.status(400).json({
      code: 400,
      errors: validated.errors
    });
  } else {
    try {
      await quoteService.importQuoteFromProvider(leadSource, payload);
      res.json();
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
};
