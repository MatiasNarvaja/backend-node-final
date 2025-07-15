exports.up = function(knex) {
  return knex.schema.createTable('productos', function(table) {
    table.increments('id').primary();
    table.string('nombre').notNullable();
    table.decimal('precio', 10, 2).notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('productos');
};
