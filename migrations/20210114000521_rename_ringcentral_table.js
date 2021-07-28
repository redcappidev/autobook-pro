exports.up = async (knex) => {
  await knex.schema.table('ringcentral_accounts', async table => {
    table.dropColumn('username');
  });
  await knex.schema.table('ringcentral_accounts', async table => {
    table.string('number').notNull();
  });
  await knex.schema.renameTable('ringcentral_accounts', 'phone_numbers');
};

exports.down = async (knex) => {
  throw Error('Down migrations not supported');
};
