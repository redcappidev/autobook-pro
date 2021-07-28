exports.up = async (knex) => {
  await knex.schema.table('vehicle_sizes', table => {
    table.string('category');
  });
};

exports.down = async (knex) => {
  throw Error('Down migrations not supported');
};
