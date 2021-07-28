exports.up = async (knex) => {
  await knex.schema.dropTable('invites');
  await knex.schema.createTable('invitations', table => {
    table.increments('id').unsigned().primary();
    table.string('encryption').unique().notNull();
    table.string('email').unique().notNull();
    table.string('role_name').notNull();
    table.text('permissions').notNull();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at');
  });
};

exports.down = async (knex) => {
  throw Error('Down migrations not supported');
};
