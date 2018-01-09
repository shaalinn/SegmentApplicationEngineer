
var express = require('express');
var router = express.Router();
var ejs = require('ejs');
var bcrypt = require('bcrypt-nodejs');
var mysql = require('./mysql');


exports.userData = function (req, res, next) {
    var json_response = {
        username: req.session.username
    }
    res.send(json_response);
}

exports.profile = function (req, res, next) {
    setTimeout(function(){userLogs.insertLog("userID: "+req.session.uid+" clicked on profile Link");},0);
    res.render('profile');
}

exports.headerFile = function (req, res, next) {
    res.render('header');
};

exports.search = function (req, res, next) {
    var searchQ = req.param("searchQ");
    var query = "SELECT p_id, p_name, ausel, price FROM ebay.advertisements WHERE p_name LIKE '%"+searchQ+"%' AND isComplete='0';";
    console.log(query);
    mysql.fetchData(function (err, result) {
        if(err){
            console.log(err);
        }else{
            setTimeout(function(){userLogs.insertLog("userID: "+req.session.uid+" searched query: "+searchQ );},0);
            res.send(result);
        }
    },query);
}