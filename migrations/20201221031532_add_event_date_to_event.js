exports.up = async (knex) => {
  await knex.schema.table('events', table => {
    table.timestamp('event_date').defaultTo(knex.fn.now());
  });
};

exports.down = async (knex) => {
  throw Error('Down migrations not supported');
};
