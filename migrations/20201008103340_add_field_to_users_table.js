exports.up = async (knex) =>
  await knex.schema.table('users', table => {
    table.boolean('activate').notNull().defaultTo(false);
  });

exports.down = async (knex) =>
  await knex.schema.table('users', table => {
    table.dropColumn('activate');
  });
