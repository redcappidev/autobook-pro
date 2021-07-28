exports.up = async (knex) =>
  await knex.schema.createTable('background_jobs', table => {
    table.increments('id').unsigned().primary();
    table.string('name').notNull();
    table.jsonb('config').nullable();
    table.integer('quote_id').unsigned().references('quotes.id').nullable();
    table.integer('user_id').unsigned().references('users.id').nullable();
    table.float('progress').defaultTo(0);
    table.string('status').defaultTo('PENDING');
    table.jsonb('result').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at');
  });

exports.down = async (knex) => {
  throw Error('Down migrations not supported');
};
