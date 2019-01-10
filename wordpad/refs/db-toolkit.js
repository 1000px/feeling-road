const dbConfig = require('@config/db.cfg.json')
const mysql = require('mysql');

// 创建连接池
let connectionPool = mysql.createPool(dbConfig.localhost);

// 建立数据库连接
let connect = callback => {
    connectionPool.getConnection((err, connection) => {
        if(err) {
            console.log('[connection create failed] - :', err);
            return;
        }
        callback(connection);
        release(connection);
    });
}

// 关闭链接
let close = connection => {
    connection.end(err => {
        if(err) {
            console.log('[connection end failed] - :', err);
            return;
        }
        console.log('[connection end succeed.');
    })
}

// 释放连接池
let release = connection => {
    connection.release(err => {
        if(err) {
            console.log('[connection release failed] - :', err);
            return ;
        }
        console.log('[connection release succeed.');
    });
}

// 执行查询
let execQuery = options => {
    let sqlStr = options.sql;
    let args = options.args;

    return new Promise((resolve, reject) => {
        connect((connection) => {
            if(!args) {
                connection.query(sqlStr, (err, result) => {
                    if(err) {
                        reject(err)
                    } else {
                        resolve(result)
                    }
                });
            } else {
                connection.query(sqlStr, args, (err, result) => {
                    if(err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            }
        });
    });
}
// 执行事务


export default {
    connect: connect,
    release: release,
    close: close,
    execQuery: execQuery
};