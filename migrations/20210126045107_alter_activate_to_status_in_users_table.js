exports.up = async (knex) => {
  await knex.schema.table('users', async table => {
    table.dropColumn('activate');
    table.string('status').defaultTo('DEACTIVATED');
  });
};

exports.down = async (knex) => {
  throw Error('Down migrations not supported');
};
