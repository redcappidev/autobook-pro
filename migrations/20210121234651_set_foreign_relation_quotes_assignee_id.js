exports.up = async (knex) =>
  await knex.schema.table('quotes', table => {
    table.foreign('assignee_id').references('users.id');
  });

exports.down = async (knex) => {
  throw Error('Down migrations not supported');
};
