import { ref, fn, raw } from 'objection';
import { Quote, Followup } from '@server/models';
import { DEFAULT_PAGE_SIZE, DATE_RANGE, DISPATCHED_STATUS, CANCELED_STATUS } from '@server/constants';
import { getDateStringFromDateObject, getDateRange, getGMTOffsetFromTimezone } from '@server/lib/date-format';
import config from '@server/config';

export const defaultPageCursor = {
  page: 0,
  size: DEFAULT_PAGE_SIZE.followup
};

const getEnhancedPageCursor = (cursor) => {
  if (cursor) {
    return {
      ...defaultPageCursor,
      ...cursor
    };
  }

  return defaultPageCursor;
};

export const setFollowUps = (quoteId, followups) => Quote.query().upsertGraph({
  id: parseInt(quoteId, 10),
  hasFollowups: followups.length > 0,
  followups: followups.map((followup) => {
    let d;
    if (followup.id) {
      d = {
        id: parseInt(followup.id, 10),
        followupOn: followup.followupOn
      };
    } else {
      d = {
        followupOn: followup.followupOn,
        quote: {
          id: quoteId
        },
        type: {
          id: parseInt(config.autobook.defaultFollowupTypeId, 10)
        }
      };
    }

    return d;
  })
}, {
  relate: true
});

export const buildFilterFollowupsQuery = ({ filterBy }) => {
  const queryBuilder = Followup.query().joinRelated('quote').where('isOrder', false);

  if (filterBy) {
    if (filterBy.group === DISPATCHED_STATUS || filterBy.group === CANCELED_STATUS) {
      const statusIdMap = {
        [DISPATCHED_STATUS]: config.autobook.dispatchedStatusId,
        [CANCELED_STATUS]: config.autobook.canceledStatusId
      };
      queryBuilder.where('quote.parentStatusId', statusIdMap[filterBy.group]);
    } else {
      const range = getDateRange(filterBy.group);
      if (range) {
        if (range.startDate) {
          queryBuilder.where('followupOn', '>=', getDateStringFromDateObject(range.startDate));
        }

        if (range.endDate) {
          queryBuilder
            .where('followupOn', '<=', getDateStringFromDateObject(range.endDate));
        }
      } else if (!filterBy.group) {
        if (filterBy.dateRangeStart) {
          queryBuilder
            .where(
              'followupOn',
              '>=',
              getDateStringFromDateObject(filterBy.dateRangeStart)
            );
        }

        if (filterBy.dateRangeEnd) {
          queryBuilder
            .where(
              'followupOn',
              '<=',
              getDateStringFromDateObject(filterBy.dateRangeEnd)
            );
        }
      }
    }

    if (filterBy.search) {
      queryBuilder
        .where((builder) => {
          builder
            .where(
              raw("lower(?? || ' ' || coalesce(??, ''))", [ref('quote.shipper:firstName').castText(), ref('quote.shipper:lastName').castText()]),
              'like',
              `%${filterBy.search.toLowerCase()}%`
            )
            .orWhere(
              fn.lower(ref('quote.shipper:companyName').castText()),
              'like',
              `%${filterBy.search.toLowerCase()}%`
            );
        });
    }

    if (filterBy.timezone) {
      queryBuilder.where(ref('shipper:timezone').castText(), '=', getGMTOffsetFromTimezone(filterBy.timezone));
    }

    if (filterBy.assigneeId) {
      queryBuilder.where('quote.assigneeId', filterBy.assigneeId);
    }

    if (filterBy.group !== DISPATCHED_STATUS && filterBy.group !== CANCELED_STATUS) {
      if (filterBy.parentStatusId) {
        queryBuilder.where('quote.parentStatusId', filterBy.parentStatusId);
      }

      if (filterBy.childStatusId) {
        queryBuilder.where('quote.childStatusId', filterBy.childStatusId);
      }
    }

    if (filterBy.engagements) {
      queryBuilder.whereJsonSupersetOf('engagements', filterBy.engagements);
    }
  }

  return queryBuilder;
};

export const getFollowupsCountByGroup = async ({ filterBy }) => {
  const queryBuilder = buildFilterFollowupsQuery({ filterBy });
  const count = await queryBuilder.count().first();
  return count.count;
};

export const getFollowupsCount = async ({ filterBy }) => {
  const today = await getFollowupsCountByGroup({
    filterBy: { ...filterBy, group: DATE_RANGE.today }
  });
  const week = await getFollowupsCountByGroup({
    filterBy: { ...filterBy, group: DATE_RANGE.week }
  });
  const month = await getFollowupsCountByGroup({
    filterBy: { ...filterBy, group: DATE_RANGE.month }
  });
  const pastDue = await getFollowupsCountByGroup({
    filterBy: { ...filterBy, group: DATE_RANGE.pastDue }
  });
  const all = await getFollowupsCountByGroup({
    filterBy: { ...filterBy, group: DATE_RANGE.all }
  });
  const dispatched = await getFollowupsCountByGroup({
    filterBy: { ...filterBy, group: DISPATCHED_STATUS }
  });
  const canceled = await getFollowupsCountByGroup({
    filterBy: { ...filterBy, group: CANCELED_STATUS }
  });

  return {
    today,
    week,
    month,
    pastDue,
    all,
    dispatched,
    canceled
  };
};

export const getFollowups = async ({ filterBy, sortBy, cursor }) => {
  const pageCursor = getEnhancedPageCursor(cursor);

  const queryBuilder = buildFilterFollowupsQuery({ filterBy });

  if (!sortBy || sortBy === 'FOLLOWUP_DATE_ASC') {
    queryBuilder.orderBy('followupOn');
  }

  if (sortBy === 'FOLLOWUP_DATE_DESC') {
    queryBuilder.orderBy('followupOn', 'desc');
  }

  if (sortBy === 'ID_ASC') {
    queryBuilder.orderBy('id');
  }

  if (sortBy === 'ID_DESC') {
    queryBuilder.orderBy('id', 'desc');
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
