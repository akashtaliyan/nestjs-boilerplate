const { timestamps } = require('../utils');
const tableName = 'users';

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

    table.string('username', 255).notNullable().unique();

    table.string('first_name').notNullable().index();
    table.string('last_name').notNullable().index();

    table.string('email', 255).notNullable().unique();
    table.string('password_hash', 255).notNullable();

    table.string('designation');

    table.boolean('isEmailVerified').defaultTo(false);

    table.boolean('is_deleted').defaultTo(false);

    table.string('provider').nullable(); // e.g., 'google', 'facebook'
    table.string('provider_id').nullable().unique(); // Unique ID from the provider

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
