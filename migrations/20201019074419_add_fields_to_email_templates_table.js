exports.up = async (knex) =>
  await knex.schema.table('email_templates', table => {
    table.integer('status_on_open').nullable();
    table.integer('status_on_click').nullable();
    table.integer('referrer').nullable();

    // Define the foreign key
    table.foreign('status_on_open').references('statuses.id');
    table.foreign('status_on_click').references('statuses.id');
  });

exports.down = async (knex) =>
  await knex.schema.table('email_templates', table => {
    table.dropColumn('status_on_open')
    table.dropColumn('status_on_click')
    table.dropColumn('referrer')
  });
