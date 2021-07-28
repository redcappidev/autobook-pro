export default {
  Dispatch: {
    order: (dispatch, _, { loaders }) => loaders.order.load(dispatch.orderId),
    driver: (dispatch, _, { loaders }) => loaders.driver.load(dispatch.driverId)
  }
};
