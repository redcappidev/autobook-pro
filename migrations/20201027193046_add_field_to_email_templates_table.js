exports.up = async (knex) =>
  await knex.schema.table('email_templates', table => {
    table.jsonb('placeholders').nullable();
  });
exports.down = async (knex) =>
  await knex.schema.table('email_templates', table => {
    table.dropColumn('placeholders');
  });
