import knex from 'knex'
import config from './configs/knex.config'

// This file is for querying database if needed in the future

const db = knex(config.development)
export default db