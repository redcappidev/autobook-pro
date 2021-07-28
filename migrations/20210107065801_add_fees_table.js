exports.up = async (knex) =>
  await knex.schema.createTable('fees', table => {
    table.increments('id').unsigned().primary();
    table.string('slug').notNull();
    table.float('fee').notNull();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at');
  });

exports.down = async (knex) => {
  throw Error('Down migrations not supported');
};
