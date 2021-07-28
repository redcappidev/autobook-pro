exports.up = async (knex) => {
  await knex.schema.table('quotes', table => {
    table.string('referrer').nullable();
  });
};

exports.down = async (knex) => {
  throw Error('Down migrations not supported');
};
