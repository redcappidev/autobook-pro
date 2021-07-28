exports.up = async (knex) => {
  await knex.schema.table('email_templates', table => {
    table.dropColumn('placeholders');
  });
};

exports.down = async (knex) => {
  throw Error('Down migrations not supported');
};
