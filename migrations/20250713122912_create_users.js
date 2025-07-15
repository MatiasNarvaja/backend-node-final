exports.up = function(knex) {
  return knex.schema.createTable('usuarios', function(table) {
    table.increments('id').primary();
    table.string('email').notNullable().unique();
    table.string('password_hash').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('usuarios');
};
