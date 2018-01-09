
var mysql = require('mysql');
var ejs = require('ejs');

var maxPoolSize, currentCount = 0;
var connectionPool = [];


function getConnection() {
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '7290',
        database: 'ebay',
        port: 3306
    });
    return connection;
};

function initializePool(startSize, maxSize) {
    console.log("connection pool will be created");
    maxPoolSize = maxSize;
    for(var i=0;i<startSize;i++){
        connectionPool.push(getConnection());
    }
};

function getConnectionFromPool() {
    if(connectionPool.length==0){
        if(currentCount != maxPoolSize){
            currentCount++;
            return getConnection()
        }else{
            console.log("all the connections are allocated");
        }
    }else{
        currentCount++;
        return connectionPool.pop();
    }
};

function returnConnection(connection) {
    currentCount--;
    connectionPool.push(connection);
}

exports.initializePool = initializePool;
exports.getConnectionFromPool = getConnectionFromPool;
exports.returnConnection = returnConnection;