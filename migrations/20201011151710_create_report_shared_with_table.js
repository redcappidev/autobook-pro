exports.up = async (knex) =>
  await knex.schema.createTable('shared_with', table => {
    table.integer('report_id').notNull();
    table.integer('user_id').notNull();
    table.timestamp('created_at');
    table.timestamp('updated_at');

    // Define the foreign key
    table.foreign('report_id').references('reports.id');
    table.foreign('user_id').references('users.id');
  });

exports.down = async (knex) => knex.schema.dropTable('shared_with');
