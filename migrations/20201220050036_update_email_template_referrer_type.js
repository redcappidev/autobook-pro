exports.up = async (knex) => {
  await knex.schema.table('email_templates', table => {
    table.string('referrer').alter();
  });
};

exports.down = async (knex) => {
  throw Error('Down migrations not supported');
};
