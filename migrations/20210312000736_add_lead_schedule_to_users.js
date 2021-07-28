exports.up = async (knex) => {
  await knex.schema.table('users', async table => {
    table.jsonb('lead_schedule').nullable();
  });
};

exports.down = async (knex) => {
  throw Error('Down migrations not supported');
};
