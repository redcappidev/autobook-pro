/* eslint-disable-next-line */
import crypto from 'crypto';

export default function randomSecret() {
  return crypto.randomBytes(16).toString('hex');
}
