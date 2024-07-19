const { timestamps } = require('../utils');
const tableName = 'user_roles_mapping';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.bigIncrements('id');
    table.bigInteger('user_id').notNullable();
    table.bigInteger('role_id').notNullable();
    table.jsonb('meta');
    timestamps(knex, table);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable(tableName);
};
