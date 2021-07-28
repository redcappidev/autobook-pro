exports.up = async (knex) => {
  await knex.schema.table('events', table => {
    table.integer('user_id').notNull();
    table.foreign('user_id').references('users.id');
  });
};

exports.down = async (knex) => {
  throw Error('Down migrations not supported');
};
