exports.up = async (knex) => {
  await knex.schema.table('users', async table => {
    table.text('permissions').alter();
  });
};

exports.down = async (knex) => {
  throw Error('Down migrations not supported');
};
