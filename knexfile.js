const {
  DB_USE_SSL = 'false',
  DB_JSON = global.DB_JSON,
  DB_HOST = '127.0.0.1',
  DB_PORT = '5432',
  DB_MIN_POOL = 2,
  DB_MAX_POOL = 10,
  DB_TYPE,
  DB_NAME,
  DB_PASSWORD,
  DB_USER,
  DATABASE_URL
} = process.env

const pg = require('pg')

const useSSL = DB_USE_SSL === '1' || DB_USE_SSL.toLowerCase() === 'true'
if (useSSL) pg.defaults.ssl = true
// see https://github.com/tgriesser/knex/issues/852

let config

if (DB_JSON) {
  config = JSON.parse(DB_JSON)
} else if (DB_TYPE) {
  config = {
    client: 'pg',
    connection: {
      host: DB_HOST,
      port: DB_PORT,
      database: DB_NAME,
      password: DB_PASSWORD,
      user: DB_USER,
      ssl: useSSL
    },
    pool: {
      min: DB_MIN_POOL,
      max: DB_MAX_POOL
    }
  }
} else if (DATABASE_URL) {
  const dbType = DATABASE_URL.match(/^\w+/)[0]
  config = {
    client: (/postgres/.test(dbType) ? 'pg' : dbType),
    connection: DATABASE_URL,
    pool: {
      min: DB_MIN_POOL,
      max: DB_MAX_POOL
    },
    ssl: useSSL
  }
} else {
  config = {
    client: 'sqlite3',
    connection: { filename: './mydb.sqlite' },
    defaultsUnsupported: true
  }
}

const test = {
  client: 'pg',
  connection: {
    host: DB_HOST,
    port: DB_PORT,
    database: 'spoke_test',
    password: 'spoke_test',
    user: 'spoke_test',
    ssl: useSSL
  }
}

module.exports = {
  development: config,
  staging: config,
  production: config,
  test
}