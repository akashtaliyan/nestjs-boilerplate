const { timestamps, onUpdateTrigger, dropTrigger } = require('../utils');
const tableName = 'external_accounts';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable(tableName, function (table) {
      table.bigIncrements('id');
      table
        .uuid('uuid')
        .notNullable()
        .index()
        .unique()
        .defaultTo(knex.raw('gen_random_uuid()'));
      table.bigInteger('user_id').unsigned().notNullable();
      table.string('provider').notNullable();

      table.string('email').notNullable();

      table.string('external_id').nullable();

      table.boolean('is_expired');

      table.jsonb('meta');

      timestamps(knex, table);
    })
    .then(() => {
      return knex.raw(onUpdateTrigger(tableName));
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable(tableName);
};
