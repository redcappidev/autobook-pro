exports.up = async (knex) =>
  await knex.schema.createTable('invites', table => {
    table.increments('id').unsigned().primary();
    table.string('email').notNull();
    table.integer('role_id').notNull();
    table.string('encryption').notNull();
    table.boolean('expired').notNull().defaultTo(false);
    table.timestamp('created_at');
    table.timestamp('updated_at');

    // Define foreign key
    table.foreign('role_id').references('roles.id');
  });

exports.down = async (knex) =>
  knex.schema.dropTable('invites');