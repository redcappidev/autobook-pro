exports.up = async (knex) => {
  await knex.schema.table('statuses', table => {
    table.boolean('reserved').defaultTo(false);
  });
};

exports.down = async (knex) => {
  throw Error('Down migrations not supported');
};
