exports.up = async (knex) =>
  await knex.schema.table('ringcentral_accounts', table => {
    table.dropColumn('password');
  });

exports.down = async (knex) => {
  throw Error('Down migrations not supported');
};
