import knex from 'knex'
import config from '../knexfile'

// This file is for querying database if needed in the future

const db = knex(config.development)
export default db