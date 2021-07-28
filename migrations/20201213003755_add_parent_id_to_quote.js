exports.up = async (knex) => {
  await knex.schema.table('quotes', table => {
    table.integer('parent_id').nullable();
    table.foreign('parent_id').references('quotes.id');
  });
};

exports.down = async (knex) => {
  throw Error('Down migrations not supported');
};
