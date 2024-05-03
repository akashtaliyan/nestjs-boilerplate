const { timestamps } = require('../utils');
const tableName = 'users_settings';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTableIfNotExists(tableName, (table) => {
    table.bigIncrements('id').primary();
    table
      .uuid('uuid')
      .notNullable()
      .index()
      .unique()
      .defaultTo(knex.raw('gen_random_uuid()'));

    table
      .uuid('user_id')
      .notNullable()
      .references('uuid')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('currency').defaultTo('rupees').notNullable();
    table.string('currency_symbol').defaultTo('₹').notNullable();
    table.string('language').defaultTo('en').notNullable();

    table.jsonb('meta');
    timestamps(knex, table);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tableName);
};
