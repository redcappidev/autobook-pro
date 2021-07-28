import numeral from 'numeral';

export const priceFormat = (value) => numeral(value).format('0.00');
