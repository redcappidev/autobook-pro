exports.up = async (knex) =>
  await knex.schema.table('email_templates', table => {
    table.text('html_body').nullable();
  });

exports.down = async (knex) =>
  await knex.schema.table('email_templates', table => {
    table.dropColumn('html_body');
  });