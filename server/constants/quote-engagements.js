export const QUOTE_ENGAGEMENT_FIRE = 'fire';
export const QUOTE_ENGAGEMENT_FLIGHT = 'flight';
export const QUOTE_ENGAGEMENT_ANGRY = 'angry';
export const QUOTE_ENGAGEMENT_AUCTION = 'auction';
export const QUOTE_ENGAGEMENT_FULLPAY = 'fullpay';
export const QUOTE_ENGAGEMENT_MULTIPLE_BROKERS = 'multiple_brokers';
export const QUOTE_ENGAGEMENT_EMAIL_OPEN = 'email_open';
export const QUOTE_ENGAGEMENT_EMAIL_CLICK = 'email_click';

export const QUOTE_ENGAGEMENTS = [{
  value: QUOTE_ENGAGEMENT_FIRE,
  icon: 'local_fire_department',
  automatic: false,
  position: 'quote_header'
}, {
  value: QUOTE_ENGAGEMENT_FLIGHT,
  icon: 'flight',
  automatic: false,
  position: 'customer_header'
}, {
  value: QUOTE_ENGAGEMENT_ANGRY,
  icon: 'sentiment_very_dissatisfied',
  automatic: false,
  position: 'customer_header'
}, {
  value: QUOTE_ENGAGEMENT_AUCTION,
  icon: 'account_balance',
  automatic: false,
  position: 'customer_header'
}, {
  value: QUOTE_ENGAGEMENT_FULLPAY,
  icon: 'credit_card',
  automatic: false,
  position: 'pricing_header'
}, {
  value: QUOTE_ENGAGEMENT_MULTIPLE_BROKERS,
  icon: 'sports_kabaddi',
  automatic: false,
  position: 'customer_header'
}, {
  value: QUOTE_ENGAGEMENT_EMAIL_OPEN,
  icon: 'drafts',
  automatic: true,
  position: 'quote_header'
}, {
  value: QUOTE_ENGAGEMENT_EMAIL_CLICK,
  icon: 'attach_email',
  automatic: true,
  position: 'quote_header'
}];
