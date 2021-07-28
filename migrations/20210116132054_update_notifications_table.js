exports.up = async (knex) =>
  await knex.schema.table('notifications', table => {
    table.boolean('viewed').notNull().defaultTo(false);
  });

exports.down = async (knex) => {
  throw Error('Down migrations not supported');
};
