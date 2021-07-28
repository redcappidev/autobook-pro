exports.up = async (knex) => {
  await knex.schema.createTable('quote_transitions', table => {
    table.increments('id').unsigned().primary();
    table.integer('quote_id').unsigned().references('quotes.id').notNull();
    table.string('from');
    table.string('to').notNull();
    table.jsonb('meta').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at');
  });
};

exports.down = async (knex) => {
  throw Error('Down migrations not supported');
};
