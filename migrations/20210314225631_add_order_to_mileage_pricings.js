exports.up = async (knex) => {
  await knex.schema.table('mileage_pricings', async table => {
    table.integer('order').unsigned();
  });
};

exports.down = async (knex) => {
  throw Error('Down migrations not supported');
};
