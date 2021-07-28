exports.up = async (knex) => {
  await knex.schema.table('mileage_pricings', table => {
    table.dropColumn('order');
  });
};

exports.down = async (knex) => {
  throw Error('Down migrations not supported');
};
