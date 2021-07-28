exports.up = async (knex) => {
  await knex.schema.table('users', table => {
    table.string('phone_number').nullable();
  });
};

exports.down = async (knex) => {
  throw Error('Down migrations not supported');
};
