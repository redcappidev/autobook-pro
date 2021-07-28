exports.up = async (knex) =>
  await knex.schema.createTable('enclosed_fees', table => {
    table.increments('id').unsigned().primary();
    table.integer('min_mileage').notNull();
    table.integer('max_mileage').notNull();
    table.float('fee').notNull();
    table.integer('order').notNull();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at');
  });

exports.down = async (knex) => {
  throw Error('Down migrations not supported');
};
