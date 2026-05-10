import mysql from 'mysql2/promise'
import { createError } from 'h3'

/** Values accepted by mysql2 for named placeholders (`:name`) */
type SqlNamedParams = Record<string, string | number | boolean | Date | null>

let pool: mysql.Pool | null = null

const isDbConnectivityError = (err: unknown) => {
  const code = (err as { code?: unknown } | null)?.code
  return (
    code === 'ETIMEDOUT' ||
    code === 'ECONNREFUSED' ||
    code === 'ENOTFOUND' ||
    code === 'EHOSTUNREACH' ||
    code === 'EAI_AGAIN'
  )
}

const toDbUnavailableError = (cause: unknown) => {
  return createError({
    statusCode: 503,
    statusMessage: 'Database unavailable',
    data: {
      hint:
        'Check MYSQL_HOST/MYSQL_PORT and that MySQL is reachable from this machine (firewall/VPN/hosting IP allowlist).'
    },
    cause
  })
}

export const getDbPool = () => {
  if (pool) {
    return pool
  }

  const config = useRuntimeConfig()

  if (!config.mysqlHost || !config.mysqlUser || !config.mysqlDatabase) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Database is not configured',
      data: {
        hint: 'Set MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE (and optionally MYSQL_PORT) in `.env`.'
      }
    })
  }

  pool = mysql.createPool({
    host: config.mysqlHost,
    port: config.mysqlPort,
    user: config.mysqlUser,
    password: config.mysqlPassword,
    database: config.mysqlDatabase,
    connectionLimit: 10,
    waitForConnections: true,
    namedPlaceholders: true,
    connectTimeout: 8_000,
    enableKeepAlive: true
  })

  return pool
}

export const queryRows = async <T>(sql: string, params: SqlNamedParams = {}) => {
  try {
    const [rows] = await getDbPool().query(sql, params)
    return rows as T[]
  } catch (err) {
    if (isDbConnectivityError(err)) {
      throw toDbUnavailableError(err)
    }
    throw err
  }
}

export const queryFirst = async <T>(sql: string, params: SqlNamedParams = {}) => {
  const rows = await queryRows<T>(sql, params)
  return rows[0] || null
}

export const executeWrite = async (sql: string, params: SqlNamedParams = {}) => {
  try {
    const [result] = await getDbPool().execute(sql, params)
    return result as mysql.ResultSetHeader
  } catch (err) {
    if (isDbConnectivityError(err)) {
      throw toDbUnavailableError(err)
    }
    throw err
  }
}
