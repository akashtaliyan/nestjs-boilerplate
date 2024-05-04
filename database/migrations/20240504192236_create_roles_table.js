const { timestamps } = require('../utils');
const tableName = 'roles';

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

    table.string('name').notNullable().unique();

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
