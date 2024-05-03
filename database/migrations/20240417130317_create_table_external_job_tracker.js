const { timestamps } = require('../utils');

const jobTrackerTableName = 'job_tracker';
exports.up = function (knex) {
  return knex.schema
    .createTable(jobTrackerTableName, function (table) {
      table.bigIncrements('id').primary(); // Primary key for the job entry
      table
        .uuid('uuid') // Universally unique identifier for the job.
        .notNullable()
        .defaultTo(knex.raw('gen_random_uuid()'))
        .index();

      table.string('job_name').index(); // Name or type of the job.
      table.string('job_status').index(); // Current status of the job.
      table.jsonb('job_data').nullable(); // Serialized job input data.

      table.timestamp('start_time', { useTz: true }).nullable(); // Start time of the job.
      table.timestamp('end_time', { useTz: true }).nullable(); // End time or failure time of the job.

      // Add created_at and updated_at columns, auto-populated by the timestamps utility function.
      timestamps(knex, table);
    })
    .createTable('job_logs', function (table) {
      table.bigIncrements('id').primary(); // Primary key for each log entry.
      table.bigInteger('job_id').index();
      table.text('log').notNullable(); // Actual log text.
      table.timestamp('log_time', { useTz: true }).defaultTo(knex.fn.now()); // Timestamp for the log entry.
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('job_logs')
    .then(() => knex.schema.dropTableIfExists(jobTrackerTableName));
};
