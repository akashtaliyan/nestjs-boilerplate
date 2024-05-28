const { timestamps } = require('../utils');
const tableName = 'users_tokens';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = function (knex) {
  return knex.schema.createTable(tableName, function (table) {
    table.increments('id').primary();

    table.string('user_id').notNullable();
    table.text('token').notNullable();

    table.jsonb('client_info');

    table.timestamp('last_used'), { useTz: false, precision: 0 };

    table.timestamp('expiry_date', { useTz: false, precision: 0 });

    table.boolean('is_expired');
    table.jsonb('meta');

    timestamps(knex, table);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable(tableName);
};
