'use strict';

module.exports = {
  host:               process.env.DB_HOST       || 'db',
  port:               parseInt(process.env.DB_PORT, 10) || 3306,
  user:               process.env.DB_USER       || 'root',
  password:           process.env.DB_PASSWORD   || '12345',
  database:           process.env.DB_NAME       || 'worldcup',
  charset:            'utf8mb4',
  connectionLimit:    parseInt(process.env.DB_POOL_LIMIT, 10) || 10,
  queueLimit:         0,
  waitForConnections: true,
  enableKeepAlive:    true,
  keepAliveInitialDelay: 0,
};
