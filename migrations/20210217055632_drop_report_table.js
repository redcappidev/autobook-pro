exports.up = async (knex) => {
  await knex.schema.dropTable('shared_with');
  await knex.schema.dropTable('reports');
};

exports.down = async (knex) => {
  throw Error('Down migrations not supported');
};
