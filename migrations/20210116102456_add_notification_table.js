exports.up = async (knex) =>
  await knex.schema.createTable('notifications', table => {
    table.increments('id').unsigned().primary();
    table.string('type').notNull();
    table.string('description').nullable();
    table.jsonb('meta').nullable();
    table.jsonb('actions').nullable();
    table.integer('user_id').unsigned().references('users.id').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at');
  });

exports.down = async (knex) => {
  throw Error('Down migrations not supported');
};
