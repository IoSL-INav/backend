/**
 * TU-B-HERE server configuration
 */

module.exports = {
    host: 'localhost' || process.env.TUB_HERE_HOST,
    port: 8080 || process.env.TUB_HERE_PORT,
    secret_type: 'code' || process.env.SECRET_TYPE, // code or file
    secret: 'secret' || process.env.SECRET, // secret or file path
    mongodb: 'mongodb://mongo-db:27017/beacons' || process.env.TUB_MONGO
}