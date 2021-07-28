import { ref, fn, raw } from 'objection';
import mapKeys from 'lodash/mapKeys';
import flatten from 'flat';
import { QuoteProvider, CentralDispatch } from '@server/third-party';
import { Quote, Dispatch, Driver, User } from '@server/models';
import {
  DEFAULT_PAGE_SIZE,
  DATE_RANGE,
  QUOTE_TRANSITIONS,
  DISPATCHED_STATUS,
  CANCELED_STATUS,
  ROLE_NAMES,
  USER_STATUSES,
  QUOTE_ENGAGEMENT_FULLPAY
} from '@server/constants';
import { assessPermission } from '@server/lib/permission-helpers';
import { getDateStringFromDateObject, getDateRange, getDayOfWeek, getHour, getMinute, getGMTOffsetFromTimezone } from '@server/lib/date-format';
import { getTimezoneFromPhoneNumber } from '@server/lib/phone-format';
import config from '@server/config';

import * as taqService from './taq-service';
import * as orderLinkService from './order-link-service';
import * as paymentService from './payment-service';
import * as followupService from './followup-service';
import * as eventService from './event-service';
import * as notificationService from './notification-service';

export const defaultPageCursor = {
  page: 0,
  size: DEFAULT_PAGE_SIZE.quote
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

export const setInternalNotes = (user, quoteId, internalNotes) => Quote.query().upsertGraph({
  id: parseInt(quoteId, 10),
  internalNotes: internalNotes.map((note) => {
    let d;
    if (note.id) {
      d = {
        id: parseInt(note.id, 10),
        note: note.note
      };
    } else {
      d = {
        note: note.note,
        noteableType: 'Quote',
        noteableId: parseInt(quoteId, 10),
        addedBy: {
          id: parseInt(user.id, 10)
        }
      };
    }
    return d;
  })
}, { relate: true });

export const powerSearch = async (user, search) => {
  if (!assessPermission.quote.canView(user) && !assessPermission.order.canView(user)) return [];

  const queryBuilder = Quote.query();

  if (!assessPermission.quote.canView(user)) {
    queryBuilder.where('isOrder', true);
  } else if (!assessPermission.order.canView(user)) {
    queryBuilder.where('isOrder', false);
  }

  const quotes = await queryBuilder.where((builder) => {
    if (Number.isInteger(+search) && +search < 2147483647) {
      builder.where('id', search);
    }

    builder
      .orWhere(
        raw("lower(?? || ' ' || coalesce(??, ''))", [ref('shipper:firstName').castText(), ref('shipper:lastName').castText()]),
        'like',
        `%${search.toLowerCase()}%`
      )
      .orWhere(
        ref('shipper:phone').castText(),
        'like',
        `%${search}%`
      )
      .orWhere(
        ref('shipper:email').castText(),
        '=',
        search
      )
      .orWhere(
        ref('shipper:phone2').castText(),
        'like',
        `%${search}%`
      )
      .orWhere(
        ref('origin:phone').castText(),
        'like',
        `%${search}%`
      )
      .orWhere(
        ref('origin:phone2').castText(),
        'like',
        `%${search}%`
      )
      .orWhere(
        ref('destination:phone').castText(),
        'like',
        `%${search}%`
      )
      .orWhere(
        ref('destination:phone2').castText(),
        'like',
        `%${search}%`
      );
  });

  return quotes;
};

export const findPossibleDuplicates = async (id) => {
  const duplicates = {};

  const quote = await Quote.query().findById(id);

  let queryBuilder = Quote.query();

  if (quote.shipper.email) {
    queryBuilder.where(fn.lower(ref('shipper:email').castText()), '=', quote.shipper.email.toLowerCase());
  }

  queryBuilder.where(ref('shipper:phone').castText(), '=', quote.shipper.phone);

  let duplicateQuotes = await queryBuilder;
  duplicates.byEmailPhone = duplicateQuotes.filter((q) => q.id !== quote.id);

  queryBuilder = Quote.query();

  if (quote.shipper.firstName) {
    queryBuilder.where(fn.lower(ref('shipper:firstName').castText()), '=', quote.shipper.firstName.toLowerCase());
  }

  queryBuilder.where(fn.lower(ref('shipper:lastName').castText()), '=', quote.shipper.lastName.toLowerCase());

  duplicateQuotes = await queryBuilder;
  duplicates.byName = duplicateQuotes.filter((q) => q.id !== quote.id);

  return duplicates;
};

export const buildFilterQuotesQuery = ({ filterBy, isOrder }) => {
  const queryBuilder = Quote.query().where((builder) => {
    if (isOrder) return builder.where('isOrder', true);
    return builder
      .where('hasFollowups', '=', false)
      .where((builder1) => builder1.where('isOrder', false).orWhereNull('isOrder'));
  });

  if (filterBy) {
    if (filterBy.search) {
      queryBuilder
        .where((builder) => {
          builder
            .where(
              raw("lower(?? || ' ' || coalesce(??, ''))", [ref('shipper:firstName').castText(), ref('shipper:lastName').castText()]),
              'like',
              `%${filterBy.search.toLowerCase()}%`
            )
            .orWhere(
              fn.lower(ref('shipper:companyName').castText()),
              'like',
              `%${filterBy.search.toLowerCase()}%`
            );
        });
    }

    if (filterBy.timezone) {
      queryBuilder.where(ref('shipper:timezone').castText(), '=', getGMTOffsetFromTimezone(filterBy.timezone));
    }

    if (filterBy.assigneeId) {
      queryBuilder.where('assigneeId', filterBy.assigneeId);
    }

    if (filterBy.group !== DISPATCHED_STATUS && filterBy.group !== CANCELED_STATUS) {
      if (filterBy.parentStatusId) {
        queryBuilder.where('parentStatusId', filterBy.parentStatusId);
      }

      if (filterBy.childStatusId) {
        queryBuilder.where('childStatusId', filterBy.childStatusId);
      }
    }

    if (filterBy.engagements) {
      queryBuilder.whereJsonSupersetOf('engagements', filterBy.engagements);
    }

    if (filterBy.group === DISPATCHED_STATUS || filterBy.group === CANCELED_STATUS) {
      const statusIdMap = {
        [DISPATCHED_STATUS]: config.autobook.dispatchedStatusId,
        [CANCELED_STATUS]: config.autobook.canceledStatusId
      };
      queryBuilder.where('parentStatusId', statusIdMap[filterBy.group]);
    } else {
      const range = getDateRange(filterBy.group);

      if (range) {
        if (range.startDate) {
          queryBuilder
            .where(
              ref('transport:availableDate').castText(),
              '>=',
              getDateStringFromDateObject(range.startDate)
            );
        }

        if (range.endDate) {
          queryBuilder
            .where(
              ref('transport:availableDate').castText(),
              '<=',
              getDateStringFromDateObject(range.endDate)
            );
        }
      } else if (!filterBy.group) {
        if (filterBy.dateRangeStart) {
          queryBuilder
            .where(
              ref('transport:availableDate').castText(),
              '>=',
              getDateStringFromDateObject(filterBy.dateRangeStart)
            );
        }

        if (filterBy.dateRangeEnd) {
          queryBuilder
            .where(
              ref('transport:availableDate').castText(),
              '<=',
              getDateStringFromDateObject(filterBy.dateRangeEnd)
            );
        }
      }
    }
  }

  return queryBuilder;
};

export const getQuotesCountByGroup = async ({ filterBy, isOrder }) => {
  const queryBuilder = buildFilterQuotesQuery({ filterBy, isOrder });
  const count = await queryBuilder.count().first();
  return count.count;
};

export const getQuotesCount = async ({ filterBy, isOrder }) => {
  const today = await getQuotesCountByGroup({
    filterBy: { ...filterBy, group: DATE_RANGE.today },
    isOrder
  });
  const week = await getQuotesCountByGroup({
    filterBy: { ...filterBy, group: DATE_RANGE.week },
    isOrder
  });
  const month = await getQuotesCountByGroup({
    filterBy: { ...filterBy, group: DATE_RANGE.month },
    isOrder
  });
  const pastDue = await getQuotesCountByGroup({
    filterBy: { ...filterBy, group: DATE_RANGE.pastDue },
    isOrder
  });
  const all = await getQuotesCountByGroup({
    filterBy: { ...filterBy, group: DATE_RANGE.all },
    isOrder
  });
  const dispatched = await getQuotesCountByGroup({
    filterBy: { ...filterBy, group: DISPATCHED_STATUS },
    isOrder
  });
  const canceled = await getQuotesCountByGroup({
    filterBy: { ...filterBy, group: CANCELED_STATUS },
    isOrder
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

export const getQuotes = async ({ filterBy, sortBy, cursor, isOrder }) => {
  const pageCursor = getEnhancedPageCursor(cursor);
  const queryBuilder = buildFilterQuotesQuery({ filterBy, isOrder });

  if (!sortBy || sortBy === 'ID_ASC') {
    queryBuilder.orderBy('id');
  }

  if (sortBy === 'ID_DESC') {
    queryBuilder.orderBy('id', 'desc');
  }

  if (sortBy === 'ORIGIN') {
    queryBuilder.orderBy(ref('origin:state')).orderBy(ref('origin:city'));
  }

  if (sortBy === 'DESTINATION') {
    queryBuilder
      .orderBy(ref('destination:state'))
      .orderBy(ref('destination:city'));
  }

  if (sortBy === 'AVAILABLE_DATE_ASC') {
    queryBuilder.orderBy(ref('transport:availableDate'));
  }

  if (sortBy === 'AVAILABLE_DATE_DESC') {
    queryBuilder.orderBy(ref('transport:availableDate'), 'desc');
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

/**
 * Updates an existing quote/order
 * @param {User} user The authenticated user who hits the backend to update a quote/order
 * @param {ID} id The stringified order/quote ID
 * @param {UpdateQuoteInput} input The quote/order payload
 */
export const updateQuote = async (user, id, input) => {
  const {
    parentStatusId,
    childStatusId,
    vehicles,
    internalNotes,
    followups,
    terms,
    engagements,
    ..._input
  } = input;

  /**
   * _input may includes the following items
   * - assigneeId
   * - referrer
   * - shipper
   * - origin
   * - destination
   * - transport
   */

  let quote;

  // If the payload has internalNotes, then fetch internalNotes of existing quote before
  // updating the notes.
  // This will allow us to find the difference between the original internal notes an
  // the new internal notes so that we can add it to the quote history clearly.
  if (internalNotes) {
    quote = await Quote.query().findById(id).withGraphFetched('internalNotes');
  } else {
    quote = await Quote.query().findById(id);
  }

  // Determines if the quote will be an order or not after this update ends.
  const isOrder = 'isOrder' in input ? input.isOrder : quote.isOrder;

  let postToLoadBoard = false;
  let deleteFromLoadBoard = false;
  let undispatched = false;

  // In order to update JSON properties in PostgreSQL, we need transform the input slightly.
  // but before the transformation, let's back the input up first.
  const patchDataJson = _input;
  if (_input.shipper && _input.shipper.phone) {
    _input.shipper.timezone = getTimezoneFromPhoneNumber(_input.shipper.phone, true);
  }
  let patchData = mapKeys(flatten(_input), (value, key) =>
    key
      .replace(/^shipper./, 'shipper:')
      .replace(/^origin./, 'origin:')
      .replace(/^destination./, 'destination:')
      .replace(/^transport./, 'transport:')
  );

  if ('engagements' in input) {
    patchDataJson.engagements = input.engagements;
    patchData.engagements = input.engagements;

    const transport = { ...quote.transport, ...(input.transport || {}) };
    const {
      basePrice = 0,
      sizeFee = 0,
      inopFee = 0,
      enclosedFee = 0,
      deposit = 0
    } = transport;
    let totalPrice = basePrice + sizeFee + inopFee + enclosedFee + deposit;

    if (
      input.engagements.includes(QUOTE_ENGAGEMENT_FULLPAY) &&
      !(quote.engagements || []).includes(QUOTE_ENGAGEMENT_FULLPAY)
    ) {
      const fullPay = Math.floor(totalPrice * 0.03);
      totalPrice += fullPay;

      patchDataJson.transport = { ...(input.transport || {}), fullPay, totalPrice };
      patchData = {
        ...patchData,
        'transport:fullPay': fullPay,
        'transport:totalPrice': totalPrice
      };
    }

    if (
      !input.engagements.includes(QUOTE_ENGAGEMENT_FULLPAY) &&
      (quote.engagements || []).includes(QUOTE_ENGAGEMENT_FULLPAY)
    ) {
      patchDataJson.transport = { ...(input.transport || {}), fullPay: 0, totalPrice };
      patchData = {
        ...patchData,
        'transport:fullPay': 0,
        'transport:totalPrice': totalPrice
      };
    }
  }

  if ('vehicles' in input) {
    patchDataJson.vehicles = vehicles;
    patchData.vehicles = vehicles;
  }

  if ('terms' in input) {
    patchDataJson.terms = terms;
    patchData.terms = terms;
  }

  // Do not allow the user to post/delete the order to/from Central Dispatch
  // unless the user has the permission.
  if ('parentStatusId' in input) {
    const postToLoadBoardStatusId = parseInt(config.autobook.postToLoadBoardStatusId, 10);

    postToLoadBoard =
      isOrder && (parentStatusId === postToLoadBoardStatusId);
    deleteFromLoadBoard =
      isOrder &&
      (quote.parentStatusId === postToLoadBoardStatusId) &&
      parentStatusId !== quote.parentStatusId;

    if (!isOrder) {
      patchDataJson.parentStatusId = parentStatusId;
      patchData.parentStatusId = parentStatusId;
    } else if (
      assessPermission.order.canPostToLoadBoardOnly(user) ||
      (!postToLoadBoard && !deleteFromLoadBoard)
    ) {
      patchDataJson.parentStatusId = parentStatusId;
      patchData.parentStatusId = parentStatusId;
    }
  }

  // Check if this update undispatches.
  if ('parentStatusId' in input) {
    const dispatchedStatusId = parseInt(config.autobook.dispatchedStatusId, 10);

    if (quote.parentStatusId === dispatchedStatusId && parentStatusId !== dispatchedStatusId) {
      undispatched = true;
    }
  }

  if ('childStatusId' in input) {
    patchDataJson.childStatusId = childStatusId;
    patchData.childStatusId = childStatusId;
  }

  const patchedQuote = await Quote.query()
    .findById(id)
    .patch(patchData)
    .returning('*');

  // Logs the quote/order transition to generate useful reports/analytics.
  const becomeOrder = isOrder && !quote.isOrder;
  const becomeQuote = !isOrder && quote.isOrder;
  if (becomeOrder || becomeQuote) {
    const last = await Quote.relatedQuery('transitions')
      .for(quote.id)
      .orderBy('createdAt', 'DESC')
      .first();

    let from;
    let to;

    if (becomeOrder) {
      if (!last) {
        from = QUOTE_TRANSITIONS.START;
        to = QUOTE_TRANSITIONS.NEW_ORDER;
      } else if (last.from === QUOTE_TRANSITIONS.START && last.to === QUOTE_TRANSITIONS.NEW_QUOTE) {
        from = QUOTE_TRANSITIONS.NEW_QUOTE;
        to = QUOTE_TRANSITIONS.NEW_ORDER;
      } else if (
        last.from === QUOTE_TRANSITIONS.NEW_ORDER && last.to === QUOTE_TRANSITIONS.NEW_QUOTE
      ) {
        from = QUOTE_TRANSITIONS.NEW_QUOTE;
        to = QUOTE_TRANSITIONS.ORDER;
      } else {
        from = QUOTE_TRANSITIONS.QUOTE;
        to = QUOTE_TRANSITIONS.ORDER;
      }
    } else if (!last) {
      console.log('this will unlikely happen');
    } else if (last.from === QUOTE_TRANSITIONS.START && last.to === QUOTE_TRANSITIONS.NEW_ORDER) {
      from = QUOTE_TRANSITIONS.NEW_ORDER;
      to = QUOTE_TRANSITIONS.NEW_QUOTE;
    } else if (
      last.from === QUOTE_TRANSITIONS.NEW_QUOTE && last.to === QUOTE_TRANSITIONS.NEW_ORDER
    ) {
      from = QUOTE_TRANSITIONS.NEW_ORDER;
      to = QUOTE_TRANSITIONS.QUOTE;
    } else {
      from = QUOTE_TRANSITIONS.ORDER;
      to = QUOTE_TRANSITIONS.QUOTE;
    }

    await Quote.relatedQuery('transitions')
      .for(quote.id)
      .insert({ from, to });
  }

  if (undispatched) {
    await Quote.relatedQuery('dispatch').for(quote.id).delete();
  }

  // Post/Delete the order to/from Central Dispatch
  if (
    isOrder &&
    postToLoadBoard &&
    assessPermission.order.canPostToLoadBoardOnly(user)
  ) {
    await CentralDispatch.postToLoadBoard(patchedQuote);
  }
  if (
    isOrder &&
    deleteFromLoadBoard &&
    assessPermission.order.canPostToLoadBoardOnly(user)
  ) {
    await CentralDispatch.deleteListing(patchedQuote);
  }

  if (quote.assigneeId && quote.assigneeId !== patchedQuote.assigneeId) {
    await notificationService.notifyAssigneeEvent(patchedQuote);
  }

  if (user) {
    await eventService.logEvent(eventService.EVENT_TYPES.updateQuote, user, {
      quote,
      patched: patchDataJson
    });

    if (internalNotes) {
      await setInternalNotes(user, id, internalNotes);
      await eventService.logEvent(eventService.EVENT_TYPES.updateQuoteNotes, user, {
        quote,
        notes: internalNotes
      });
    }

    if (followups) {
      await followupService.setFollowUps(quote.id, followups);
      await eventService.logEvent(eventService.EVENT_TYPES.setFollowup, user, {
        quote,
        followups
      });
    }

    const notificationOptions = {
      canSendSMS: !patchedQuote.shipper.noText,
      canSendEmail: !patchedQuote.shipper.noEmail
    };

    if (quote.parentStatusId !== patchedQuote.parentStatusId) {
      notificationOptions.parentStatusChange = true;
    }

    if (quote.childStatusId && quote.childStatusId !== patchedQuote.childStatusId) {
      notificationOptions.childStatusChange = false;
    }

    await notificationService.notifyQuoteStatusChange(user, patchedQuote, notificationOptions);
  }

  return patchedQuote;
};

export const importQuoteFromProvider = async (source, rawData, save = true) => {
  const quoteProvider = new QuoteProvider(source);
  const result = quoteProvider.parse(rawData);

  if (result.parsed) {
    const timezone = getTimezoneFromPhoneNumber(result.quote.shipper.phone, true);
    if (timezone) result.quote.shipper.timezone = timezone;

    let quote;

    // If save is true, let's save the quote first so that
    // we won't lose any quotes from any providers.
    if (save) {
      quote = await Quote.query().insert(result.quote);

      await Quote.relatedQuery('transitions')
        .for(quote.id)
        .insert({
          from: QUOTE_TRANSITIONS.START,
          to: QUOTE_TRANSITIONS.NEW_QUOTE
        });
    }

    let taqResult = {};
    try {
      if (!result.quote.transport.totalPrice) {
        taqResult = await taqService.calcQuotePrice(result.quote);
      }
    } catch (error) {
      console.log('taq price calculation failed');
    }

    if (save) {
      // Determine an assignee according to the lead schedule of users.
      const dayOfWeek = getDayOfWeek().toLowerCase();
      const now = `${getHour()}:${getMinute()}`;
      const users = await User.query().where('status', USER_STATUSES.ACTIVATED).withGraphFetched('role');

      const candidates = users.map((user) => {
        if (user.leadSchedule) return user;
        return {
          ...user,
          leadSchedule: { ratio: 1, maxCap: 10 }
        };
      }).filter((user) => {
        if ('pause' in user.leadSchedule) return !user.leadSchedule.pause;
        return true;
      }).filter((user) => {
        if (user.leadSchedule.wholeDay) return true;

        const today = getDateStringFromDateObject(new Date());
        if (
          user.leadSchedule.today &&
          user.leadSchedule.today === today &&
          user.leadSchedule.todayLeads >= user.leadSchedule.maxCap
        ) {
          return false;
        }

        const start = user.leadSchedule[`${dayOfWeek}Start`];
        const end = user.leadSchedule[`${dayOfWeek}End`];
        if (!start || !end) return false;
        return now >= start && now <= end;
      });

      let assignee = null;

      if (candidates.length > 0) {
        const slots = [];
        candidates.forEach((candidate) => {
          const count = Math.ceil(candidate.leadSchedule.ratio);
          for (let index = 0; index < count; index += 1) {
            slots.push(candidate);
          }
        });

        assignee = slots[Math.floor(Math.random() * slots.length)];
      } else {
        assignee = users.find((user) => user.role.name === ROLE_NAMES.SUPERADMIN);
      }

      const today = getDateStringFromDateObject(new Date());
      const assigneeLeadSchedule = assignee.leadSchedule || {};
      await User.query().findById(assignee.id).patch({
        leadSchedule: {
          ...assigneeLeadSchedule,
          today,
          todayLeads:
            assigneeLeadSchedule.today !== today
              ? 0
              : ((assigneeLeadSchedule.todayLeads || 0) + 1)
        }
      });

      await eventService.logEvent(eventService.EVENT_TYPES.createQuote, null, { quote });

      return updateQuote(null, quote.id, {
        assigneeId: assignee.id,
        transport: {
          ...result.quote.transport,
          ...taqResult
        }
      });
    }

    return {
      ...result.quote,
      transport: {
        ...result.quote.transport,
        ...taqResult
      }
    };
  }

  console.log('Quote parsing error', result.error);
  throw new Error(
    'Parsing error: the quote is misisng some values or has invalid values'
  );
};

/**
 * Creates a quote
 * @param {User} user The authenticated user who hits backend to create a quote
 * @param {CreateQuoteInput} input New quote payload
 */
export const createQuote = async (user, input) => {
  const quoteData = await importQuoteFromProvider(null, input, false);

  const quote = await Quote.query()
    .insert({
      ...quoteData,
      assigneeId: parseInt(input.assigneeId, 10),
      isOrder: false,
      engagements: input.engagements
    })
    .returning('*');

  await Quote.relatedQuery('transitions')
    .for(quote.id)
    .insert({
      from: QUOTE_TRANSITIONS.START,
      to: QUOTE_TRANSITIONS.NEW_QUOTE
    });

  if (input.internalNotes.length > 0) {
    await setInternalNotes(user, quote.id, input.internalNotes);
  }

  if (input.followups.length > 0) {
    await followupService.setFollowUps(quote.id, input.followups);
  }

  await eventService.logEvent(eventService.EVENT_TYPES.createQuote, user, { quote });

  const notificationOptions = {
    canSendSMS: !quote.shipper.noText,
    canSendEmail: !quote.shipper.noEmail,
    parentStatusChange: true,
    childStatusChange: true
  };
  await notificationService.notifyQuoteStatusChange(user, quote, notificationOptions);

  return quote;
};

/**
 * Creates an order
 * @param {User} user The authenticated user who hits backend to create an order
 * @param {CreateOrderInput} input New order payload
 */
export const createOrder = async (user, input) => {
  const quoteData = await importQuoteFromProvider(null, input, false);

  const quote = await Quote.query()
    .insert({
      ...quoteData,
      assigneeId: parseInt(input.assigneeId, 10),
      isOrder: true,
      engagements: input.engagements
    });

  await Quote.relatedQuery('transitions')
    .for(quote.id)
    .insert({
      from: QUOTE_TRANSITIONS.START,
      to: QUOTE_TRANSITIONS.NEW_ORDER
    });

  if (input.internalNotes && input.internalNotes.length > 0) {
    await setInternalNotes(user, quote.id, input.internalNotes);
  }

  if (input.followups && input.followups.length > 0) {
    await followupService.setFollowUps(quote.id, input.followups);
  }

  await eventService.logEvent(eventService.EVENT_TYPES.createQuote, user, { quote });

  const notificationOptions = {
    canSendSMS: !quote.shipper.noText,
    canSendEmail: !quote.shipper.noEmail,
    parentStatusChange: true,
    childStatusChange: true
  };
  await notificationService.notifyQuoteStatusChange(user, quote, notificationOptions);

  return quote;
};

export const reassignQuotes = async (ids, userId) => Quote.query().whereIn('id', ids).patch({ assigneeId: userId }).returning('*');

export const postToLoadBoard = async (id) => {
  const postToLoadBoardStatusId = parseInt(config.autobook.postToLoadBoardStatusId, 10);

  const patchedQuote = await Quote.query()
    .findById(id)
    .patch({
      parentStatusId: postToLoadBoardStatusId,
      childStatusId: null
    })
    .returning('*');

  await CentralDispatch.postToLoadBoard(patchedQuote);

  return patchedQuote;
};

export const removeFromLoadBoard = async (id) => {
  const patchedQuote = await Quote.query()
    .findById(id)
    .patch({
      parentStatusId: null,
      childStatusId: null
    })
    .returning('*');

  await CentralDispatch.deleteListing(patchedQuote);

  return patchedQuote;
};

export const duplicateQuote = async (user, id, mode) => {
  const {
    id: _,
    createdAt,
    updatedAt,
    terms,
    origin,
    destination,
    hasFollowups,
    ...quote
  } = await Quote.query().findById(id);

  let newQuote;

  if (mode === 'STANDARD') {
    newQuote = await Quote.query()
      .insert({
        ...quote,
        origin,
        destination,
        parentId: parseInt(id, 10)
      })
      .returning('*');
  } else {
    newQuote = await Quote.query()
      .insert({
        ...quote,
        origin: destination,
        destination: origin,
        parentId: parseInt(id, 10)
      })
      .returning('*');
  }

  await Quote.relatedQuery('transitions')
    .for(newQuote.id)
    .insert({
      from: QUOTE_TRANSITIONS.START,
      to: newQuote.isOrder ? QUOTE_TRANSITIONS.NEW_ORDER : QUOTE_TRANSITIONS.NEW_QUOTE
    });

  await eventService.logEvent(
    eventService.EVENT_TYPES.duplicateQuote,
    user,
    { id, quote: newQuote, mode }
  );

  return newQuote;
};

export const convertToOrder = async (user, quoteId, input) => updateQuote(user, quoteId, {
  ...input,
  isOrder: true,
  parentStatusId: null,
  childStatusId: null
});

export const convertToQuote = async (user, orderId) => updateQuote(user, orderId, {
  isOrder: false,
  parentStatusId: null,
  childStatusId: null
});

export const setPaymentInfoToOrder = async (orderId, billingInfo) => {
  const {
    payerId,
    payerBillingMethodId
  } = await paymentService.createPayerIfNecessary(billingInfo);

  return Quote.query().upsertGraphAndFetch(
    {
      id: parseInt(orderId, 10),
      payer: {
        id: payerId
      },
      payerBillingMethod: {
        id: payerBillingMethodId
      }
    },
    { relate: true, unrelate: true }
  );
};

export const getOrderBillingInfo = async (orderId) => {
  const order = await Quote.query()
    .findById(orderId)
    .withGraphFetched('[payer,payerBillingMethod]');
  const anetProfileId = order.payer ? order.payer.anetProfileId : null;
  const anetPaymentProfileId = order.payerBillingMethod
    ? order.payerBillingMethod.anetPaymentProfileId
    : null;

  return paymentService.getBillingInformation(
    anetProfileId,
    anetPaymentProfileId
  );
};

export const chargeOrder = async (orderId, amount, note) => {
  const order = await Quote.query()
    .findById(orderId)
    .withGraphFetched('[payer, payerBillingMethod]');
  const { terms } = order;

  if (terms && terms.accepted) {
    const anetProfileId = order.payer ? order.payer.anetProfileId : null;
    const anetPaymentProfileId = order.payerBillingMethod
      ? order.payerBillingMethod.anetPaymentProfileId
      : null;

    const transaction = await paymentService.chargeCustomer(
      anetProfileId,
      anetPaymentProfileId,
      amount
    );

    if (!transaction) return null;

    await Quote.relatedQuery('transactions')
      .for(orderId)
      .insert({
        amount,
        note,
        transactionId: transaction.id
      });

    return order;
  }

  return null;
};

export const dispatchOrder = async (orderId, input) => {
  await Quote.relatedQuery('dispatch').for(orderId).insert({
    ...input,
    status: 'DISPATCHED'
  });

  return Quote.query()
    .findById(orderId)
    .patch({
      parentStatusId: parseInt(config.autobook.dispatchedStatusId, 10)
    })
    .returning('*');
};

export const updateQuoteByCustomer = async (encryption, input, clientIp) => {
  const quote = await orderLinkService.resolveBookOrderLink(encryption);

  const { billingInformation, ..._input } = input;

  if (_input.terms) {
    _input.terms.signedAt = new Date().toISOString();
    _input.terms.clientIp = clientIp;
  }

  if (_input) {
    await updateQuote(null, quote.id, _input);
  }

  if (billingInformation) {
    await setPaymentInfoToOrder(quote.id, billingInformation);

    if (quote.vehicles) {
      quote.vehicles = quote.vehicles.map((vehicle) => ({
        ...vehicle,
        sizeId: vehicle.sizeId || parseInt(config.autobook.defaultVehicleSizeId, 10)
      }));
    }

    await updateQuote(null, quote.id, {
      vehicles: quote.vehicles,
      isOrder: true,
      parentStatusId: input.parentStatusId || null,
      childStatusId: input.childStatusId || null
    });
  }
};

export const acceptTermsAndConditions = async (encryption, input, clientIp) => {
  const order = await orderLinkService.resolveTermsAndConditionsLink(encryption);

  await updateQuote(null, order.id, {
    terms: {
      ...input,
      signedAt: new Date().toISOString(),
      clientIp
    }
  });
};

export const provideBillingInfo = async (encryption, input) => {
  const order = await orderLinkService.resolveBillingInformationLink(encryption);

  await setPaymentInfoToOrder(order.id, input);
};

export const getExperiencedCarriers = async (orderId) => {
  const { origin, destination } = await Quote.query().findById(orderId);
  const dispatchedOrders = await Dispatch
    .query()
    .withGraphFetched('order');

  const carriers = [];
  let lenOrders = dispatchedOrders.length;

  const getDrivers = async () => {
    lenOrders -= 1;
    const { driverId, order } = dispatchedOrders[lenOrders];
    if (
      order.origin.state === origin.state ||
      order.destination.state === origin.state ||
      order.origin.state === destination.state ||
      order.destination.state === destination.state
    ) {
      const carrier = await Driver.relatedQuery('carrier').for(driverId);
      carriers.push(carrier);
    }

    if (lenOrders > 0) {
      getDrivers();
    }
  };

  getDrivers();
  return carriers;
};
