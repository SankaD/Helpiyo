// const mysql = require('promise-mysql');

const ConnectionHandler = {
    _pool: null,
    getPool: () => {
        if (this._pool) {
            return Promise.resolve(this.pool);
        }
        return mysql.createPool({
            connectionLimit: 20,
            host: "localhost",
            user: "root",
            password: "",
            database: "coins"
        })
            .then(pool => {
                this._pool = pool;
                return this._pool;
            });
    },
    getConnection: () => {
        return this.getPool()
            .getConnection(connection => {
                return connection;
            });
    }
};

module.exports = ConnectionHandler;