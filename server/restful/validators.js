import Ajv from 'ajv';
import runTaqSchema from './payload-schemas/run-taq.schema';
import websiteLeadSchema from './payload-schemas/website-lead.schema';

export const validateRunTaqPayload = (payload) => {
  const ajv = Ajv({ allErrors: true });
  const validate = ajv.compile(runTaqSchema);
  const valid = validate(payload);

  if (!valid) {
    return {
      valid: false,
      errors: validate.errors
    };
  }

  return { valid: true };
};

export const validateWebsiteLeadPayload = (payload) => {
  const ajv = Ajv({ allErrors: true });
  const validate = ajv.compile(websiteLeadSchema);
  const valid = validate(payload);

  if (!valid) {
    return {
      valid: false,
      errors: validate.errors
    };
  }

  return { valid: true };
};
