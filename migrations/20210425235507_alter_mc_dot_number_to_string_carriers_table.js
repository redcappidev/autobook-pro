exports.up = async (knex) => {
  await knex.schema.table('carriers', async table => {
    table.string('mc_number').alter();
    table.string('dot_number').alter();
  });
};

exports.down = async (knex) => {
  throw Error('Down migrations not supported');
};
