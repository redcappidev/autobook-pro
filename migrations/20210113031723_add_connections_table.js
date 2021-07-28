exports.up = async (knex) =>
  await knex.schema.createTable('connections', table => {
    table.increments('id').unsigned().primary();
    table.integer('user_id').unsigned().references('users.id').notNull();
    table.string('connection_id').notNull();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at');

    table.unique('user_id');
  });

exports.down = async (knex) => {
  throw Error('Down migrations not supported');
};
