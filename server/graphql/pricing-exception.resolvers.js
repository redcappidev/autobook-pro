import { raw } from 'objection';
import { UserInputError } from 'apollo-server';
import mapKeys from 'lodash/mapKeys';
import omitBy from 'lodash/omitBy';
import isEmpty from 'lodash/isEmpty';
import { PricingException } from '@server/models';
import { DEFAULT_PAGE_SIZE } from '@server/constants';

const defaultPageCursor = {
  page: 0,
  size: DEFAULT_PAGE_SIZE.pricingException
};

export default {
  PricingException: {
    rules: (parent) => [
      {
        originRadius: parent.originRadius1,
        destRadius: parent.destRadius1,
        price: parent.price1
      },
      {
        originRadius: parent.originRadius2,
        destRadius: parent.destRadius2,
        price: parent.price2
      },
      {
        originRadius: parent.originRadius3,
        destRadius: parent.destRadius3,
        price: parent.price3
      }
    ]
  },
  Query: {
    pricingExceptions: async (_, { filter, cursor }) => {
      const pageCursor = cursor
        ? {
            ...defaultPageCursor,
            ...cursor
          }
        : defaultPageCursor;

      const result = await PricingException.query()
        .where(omitBy(filter, isEmpty))
        .orderBy([
          { column: 'origin_state', order: 'ASC' },
          { column: 'origin_city', order: 'ASC' },
          { column: 'dest_state', order: 'ASC' },
          { column: 'dest_city', order: 'ASC' }
        ])
        .page(pageCursor.page, pageCursor.size);

      return {
        data: result.results,
        pageInfo: {
          ...pageCursor,
          total: result.total
        }
      };
    }
  },
  Mutation: {
    createPricingException: async (
      _,
      { originState, originCity, destState, destCity, pricingRules }
    ) => {
      const enhancedPricingRules = [].concat(pricingRules);
      const newPricingException = {
        originState,
        originCity,
        destState,
        destCity
      };

      if (enhancedPricingRules.length === 1) {
        enhancedPricingRules.push({
          originRadius: 0,
          destRadius: 0,
          price: 0
        });
      }

      if (enhancedPricingRules.length === 2) {
        enhancedPricingRules.push({
          originRadius: 0,
          destRadius: 0,
          price: 0
        });
      }

      enhancedPricingRules.length = 3;

      enhancedPricingRules.forEach((pricingRule, index) => {
        newPricingException[`originRadius${index + 1}`] =
          pricingRule.originRadius;
        newPricingException[`destRadius${index + 1}`] = pricingRule.destRadius;
        newPricingException[`price${index + 1}`] = pricingRule.price;
      });

      return PricingException.query()
        .insert(newPricingException)
        .returning('*');
    },
    updatePricingRule: (_, { pricingExceptionID, priority, pricingRule }) => {
      if (![1, 2, 3].includes(priority)) {
        throw new UserInputError('Priority is invalid', {
          invalidArgs: ['priority']
        });
      }

      return PricingException.query()
        .findById(pricingExceptionID)
        .patch(mapKeys(pricingRule, (value, key) => `${key}${priority}`))
        .returning('*');
    },
    updatePricingRules: (_, { pricingExceptionIDs, priority, pricingRule }) => {
      if (![1, 2, 3].includes(priority)) {
        throw new UserInputError('Priority is invalid', {
          invalidArgs: ['priority']
        });
      }

      if ('priceBump' in pricingRule) {
        const temp = { ...pricingRule };
        temp.price = raw(`price${priority} + ${pricingRule.priceBump}`);
        delete temp.priceBump;

        return PricingException.query()
          .whereIn('id', pricingExceptionIDs)
          .patch(mapKeys(temp, (value, key) => `${key}${priority}`))
          .returning('*');
      }

      return PricingException.query()
        .whereIn('id', pricingExceptionIDs)
        .patch(mapKeys(pricingRule, (value, key) => `${key}${priority}`))
        .returning('*');
    },
    deletePricingException: async (_, { pricingExceptionID }) => {
      const theDeleted = await PricingException.query()
        .findById(pricingExceptionID)
        .delete()
        .returning('*');
      return theDeleted;
    }
  }
};
