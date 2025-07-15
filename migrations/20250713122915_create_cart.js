exports.up = function(knex) {
  return knex.schema.createTable('carrito', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.integer('producto_id').unsigned().notNullable();
    table.integer('cantidad').notNullable();

    table.foreign('user_id').references('id').inTable('usuarios');
    table.foreign('producto_id').references('id').inTable('productos');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('carrito');
};
