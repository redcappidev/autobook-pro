import { VehicleSizeChart } from '@server/models';
import { DEFAULT_PAGE_SIZE } from '@server/constants';

const defaultPageCursor = {
  page: 0,
  size: DEFAULT_PAGE_SIZE.vehicleSizeChart
};

export default {
  VehicleSizeChart: {
    size: (sizeChart, _, { loaders }) => {
      if (sizeChart.sizeId) {
        return loaders.vehicleSize.load(sizeChart.sizeId);
      }

      return null;
    }
  },
  Query: {
    vehicleSizeCharts: async (_, { filter, cursor }) => {
      const pageCursor = cursor
        ? {
            ...defaultPageCursor,
            ...cursor
          }
        : defaultPageCursor;

      const result = await VehicleSizeChart.query()
        .whereLike('make', filter.make)
        .whereLike('model', filter.model)
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
    createVehicleSizeChart: async (_, { sizeChartData, sizeID }) => {
      const newSizeChart = await VehicleSizeChart.query().insert(sizeChartData);
      await newSizeChart.$relatedQuery('size').relate(sizeID);
      return VehicleSizeChart.query().findById(newSizeChart.id);
    },
    updateVehicleSizeChartSize: async (_, { sizeChartID, sizeID }) => {
      await VehicleSizeChart.relatedQuery('size')
        .for(sizeChartID)
        .relate(sizeID);
      return VehicleSizeChart.query().findById(sizeChartID);
    },
    deleteVehicleSizeChart: async (_, { sizeChartID }) => {
      const theDeleted = await VehicleSizeChart.query()
        .delete()
        .findById(sizeChartID)
        .returning('*');
      return theDeleted;
    }
  }
};
