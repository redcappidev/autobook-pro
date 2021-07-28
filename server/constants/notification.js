export const NOTIFICATION_TYPE_POSITIVE = 'POSITIVE';
export const NOTIFICATION_TYPE_NEGATIVE = 'NEGATIVE';
export const NOTIFICATION_TYPE_WARNING = 'WARNING';
export const NOTIFICATION_TYPE_INFO = 'INFO';
export const NOTIFICATION_TYPE_ONGOING = 'ONGOING';

export const NOTIFICATION_ACTION_VIEW_QUOTE = 'VIEW_QUOTE';

export const NOTIFICATION_ACTIONS = [{
  type: NOTIFICATION_ACTION_VIEW_QUOTE,
  label: 'Go to quote',
  handler: (action) => {
    const path = `${action.order ? 'orders' : 'quotes'}/${action.quoteId}`;
    window.open(`${window.BASE_URL}/${path}`, '_blank');
  }
}];
