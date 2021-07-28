exports.up = async (knex) => {
  await knex.schema.table('quotes', async table => {
    table.dropColumn('fire');
    table.jsonb('engagements');
  });
};

exports.down = async (knex) => {
  throw Error('Down migrations not supported');
};
