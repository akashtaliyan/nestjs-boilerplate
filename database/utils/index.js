exports.timestamps = function (knex, table) {
  table
    .timestamp('createdAt', { useTz: false, precision: 0 })
    .notNullable()
    .defaultTo(knex.raw('now()::timestamp'));

  table
    .timestamp('updatedAt', { useTz: false, precision: 0 })
    .notNullable()
    .defaultTo(knex.raw('now()::timestamp'));
};

exports.onUpdateTrigger = (table) => `
    CREATE TRIGGER ${table}_updatedAt
    BEFORE UPDATE ON ${table}
    FOR EACH ROW
    EXECUTE PROCEDURE on_update_timestamp();
  `;

exports.ON_UPDATE_TIMESTAMP_FUNCTION = `
    CREATE OR REPLACE FUNCTION on_update_timestamp()
    RETURNS trigger AS $$
    BEGIN
      NEW."updatedAt" = now()::timestamp;
      RETURN NEW;
    END;
  $$ language 'plpgsql';
  `;
