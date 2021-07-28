exports.up = async (knex) => {
  await knex.schema.table('roles', async table => {
    table.dropColumn('permissions');
  });
  await knex.schema.table('users', async table => {
    table.string('permissions');
  });
};

exports.down = async (knex) => {
  throw Error('Down migrations not supported');
};
