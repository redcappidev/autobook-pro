exports.up = async (knex) => {
  await knex.schema.table('events', async table => {
    table.integer('user_id').nullable().alter();
  });
};

exports.down = async (knex) => {
  throw Error('Down migrations not supported');
};
