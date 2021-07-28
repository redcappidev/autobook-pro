export default {
  Transaction: {
    order: (transaction, _, { loaders }) =>
      loaders.order.load(transaction.orderId)
  }
};
