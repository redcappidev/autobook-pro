exports.up = async (knex) => {
  await knex.schema.table('carriers', async table => {
    table.text('city').nullable().alter();
    table.text('state').nullable().alter();
    table.text('zipcode').nullable().alter();
    table.text('first_contact').nullable().alter();
  });
};

exports.down = async (knex) => {
  throw Error('Down migrations not supported');
};
