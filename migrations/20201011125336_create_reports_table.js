exports.up = async (knex) =>
  await knex.schema.createTable('reports', table => {
    table.increments('id').unsigned().primary();
    table.integer('user_id').notNull();
    table.string('name').notNull();
    table.jsonb('matrix').nullable();
    table.timestamp('created_at');
    table.timestamp('updated_at');

    // Define foreign key
    table.foreign('user_id').references('users.id');
  });

exports.down = async (knex) => knex.schema.dropTable('reports');
