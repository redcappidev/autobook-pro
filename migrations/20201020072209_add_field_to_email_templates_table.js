exports.up = async (knex) =>
  await knex.schema.table('email_templates', table => {
    table.string('email_subject').nullable();
  });


exports.down = async (knex) =>
  await knex.schema.table('email_templates', table => {
    table.dropColumn('email_subject');
  });