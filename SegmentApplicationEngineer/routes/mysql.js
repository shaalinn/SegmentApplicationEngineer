
var mysql = require('mysql');
var ejs = require('ejs');
var pool = require("./databasePool");

exports.fetchData = function (callback, sqlQuery) {
    console.log("data fetching");
    var connection = pool.getConnectionFromPool();
    connection.query(sqlQuery, function (err, rows, fields) {
        if(err){
            console.log("Error: "+ err.message);
        }else{
            console.log("query success");
            callback(err,rows);

        }
    });
    pool.returnConnection(connection);
};

exports.storeData = function (callback, sqlQuery) {
    console.log("data storing");
    var connection = pool.getConnectionFromPool();
    connection.query(sqlQuery, function (err, results) {
        if(err){
            console.log("Error: "+err);
            callback(err,results);
        }else{
            console.log("\nConnection released");
            console.log("Query Success");
            callback(err,results);
        }
    });
    pool.returnConnection(connection);

};
