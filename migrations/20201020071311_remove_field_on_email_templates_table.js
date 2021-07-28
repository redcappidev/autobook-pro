exports.up = async (knex) =>
  await knex.schema.table('email_templates', table => {
    table.dropColumn('template_name');
    table.dropColumn('placeholders');
  });

exports.down = async (knex) =>
  await knex.schema.table('email_templates', table => {
    table.string('template_name');
    table.string('placeholders');
  });
