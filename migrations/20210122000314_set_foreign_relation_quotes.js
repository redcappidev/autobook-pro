exports.up = async (knex) =>
  await knex.schema.table('quotes', table => {
    table.foreign('payer_billing_method_id').references('payer_billing_methods.id');
  });

exports.down = async (knex) => {
  throw Error('Down migrations not supported');
};
