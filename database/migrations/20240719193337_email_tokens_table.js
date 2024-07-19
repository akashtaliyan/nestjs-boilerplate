const { timestamps, onUpdateTrigger, dropTrigger } = require('../utils');
const tableName = 'email_tokens';

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
      table.string('account_email').notNullable();
      table.bigInteger('account_id').unsigned().notNullable();

      table.string('email_record_id').notNullable();
      table.string('thread_id').notNullable();

      table.boolean('is_ready').defaultTo(false);

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
