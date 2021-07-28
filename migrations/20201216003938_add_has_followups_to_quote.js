exports.up = async (knex) => {
  await knex.schema.table('quotes', table => {
    table.boolean('has_followups').notNull().defaultTo(false);
  });
};

exports.down = async (knex) => {
  throw Error('Down migrations not supported');
};
