exports.up = async (knex) => {
  await knex.schema.createTable('short_codes', table => {
    table.increments('id').unsigned().primary();
    table.string('alias').notNull();
    table.string('short_code').notNull();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at');
  });
};

exports.down = async (knex) => {
  throw Error('Down migrations not supported');
};
