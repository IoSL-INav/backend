/**
 * TU-B-HERE server configuration
 */

module.exports = {
    host: process.env.TUB_HERE_HOST || 'localhost',
    port: process.env.TUB_HERE_PORT || 8080,
    secret_type: process.env.SECRET_TYPE || 'code', // code or file
    secret: process.env.SECRET || 'secret', // secret or file path
    mongodb: process.env.TUB_MONGO || 'mongodb://mongo-db:27017/beacons'
}