import { Carrier } from '@server/models';
import { ref, raw } from 'objection';
import { DEFAULT_PAGE_SIZE } from '@server/constants';

export const defaultPageCursor = {
  page: 0,
  size: DEFAULT_PAGE_SIZE.quote
};

export const getCarriers = async ({ search, sortBy, cursor }) => {
  let pageCursor = defaultPageCursor;
  if (cursor) {
    pageCursor = {
      ...defaultPageCursor,
      ...cursor
    };
  }

  let queryBuilder = Carrier.query();

  if (search) {
    queryBuilder = Carrier.query().where(
        raw('lower(??)', [ref('companyName').castText()]), 'LIKE', `%${search.toLowerCase()}%`)
      .orWhere(raw('lower(??)', [ref('address').castText()]), 'LIKE', `%${search.toLowerCase()}%`)
      .orWhere(raw('lower(??)', [ref('mcNumber').castText()]), 'LIKE', `%${search.toLowerCase()}%`);
  }

  if (sortBy === 'NAME_ASC') {
    queryBuilder.orderBy('companyName', 'asc');
  }

  if (!sortBy || sortBy === 'NAME_DESC') {
    queryBuilder.orderBy('companyName', 'desc');
  }

  if (sortBy === 'MC_NUMBER_ASC') {
    queryBuilder.orderBy('mcNumber');
  }

  if (sortBy === 'MC_NUMBER_DESC') {
    queryBuilder.orderBy('mcNumber', 'desc');
  }

  if (sortBy === 'LOCATION_ASC') {
    queryBuilder.orderBy('address');
  }

  if (sortBy === 'LOCATION_DESC') {
    queryBuilder.orderBy('address', 'desc');
  }

  const result = await queryBuilder.page(pageCursor.page, pageCursor.size);
  return {
    data: result.results,
    pageInfo: {
      ...pageCursor,
      total: result.total
    }
  };
};
