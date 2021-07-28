exports.up = async (knex) =>
  await knex.schema.alterTable('quotes', table => {
    table.boolean('is_order').defaultTo(false).alter();
  });

exports.down = async (knex) => {
  throw Error('Down migrations not supported');
};
