exports.up = async (knex) => {
  await knex.schema.table('email_templates', async table => {
    table.dropColumn('referrer');
  });
  await knex.schema.table('email_templates', async table => {
    table.jsonb('referrers');
  });
};

exports.down = async (knex) => {
  throw Error('Down migrations not supported');
};
