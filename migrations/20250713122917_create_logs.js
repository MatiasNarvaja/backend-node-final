exports.up = function(knex) {
  return knex.schema.createTable('logs', function(table) {
    table.increments('id').primary();
    table.timestamp('timestamp').defaultTo(knex.fn.now());
    table.integer('user_id').unsigned();
    table.string('endpoint');
    table.string('metodo');
    table.integer('estado');
    table.string('mensaje');

    table.foreign('user_id').references('id').inTable('usuarios');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('logs');
};
