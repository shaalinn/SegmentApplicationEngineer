var express = require('express');
var router = express.Router();
var ejs = require('ejs');
var bcrypt = require('bcrypt-nodejs');
var mysql = require('./mysql');
var request = require('request');

/* GET home page. */
exports.indexPage = function(req, res, next) {

    if(req.session.uid == null){
        res.render('signinup');
    }else{
        res.render('index');
    }
};

exports.productList = function (req, res, next) {
    var query = "SELECT p_id, p_name, ausel, price FROM ebay.advertisements WHERE u_id <>'"+req.session.uid+"' AND isComplete ='0' AND quantity>'0';";
    console.log(query);
    mysql.fetchData(function (err, result) {
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    },query);
};

exports.productDetails = function (req, res, next) {
    if(req.session.uid == null){
        res.render('signinup');
    }else{
        var pid = Number(req.params.id);
        var query = "SELECT advertisements.p_id, advertisements.p_name, advertisements.p_desc, advertisements.price, advertisements.quantity, advertisements.ausel, advertisements.isEnd, advertisements.source, user_info.u_id, user_info.fname, user_info.lname, user_info.username from advertisements Join user_info where advertisements.p_id='"+pid+"' AND advertisements.u_id=user_info.u_id;"
        console.log(query);
        mysql.fetchData(function (err, result) {
            if(err){
                console.log(err);
            }else{
                var isend = result[0].isEnd;
                console.log(isend);
                var currenttime = Math.floor(Date.now()/1000);
                isend = isend - currenttime;
                console.log(isend);
                var remain = convertTime(isend);
                result[0].isEnd = remain;
                setTimeout(function(){userLogs.insertLog("userID: "+req.session.uid+" open ProductID: "+pid);},0);
                res.render('product', {result : result});
            }
        },query);
    }

}

exports.tables = function (req, res, next) {
    if(req.session.uid == null){
        res.render('signinup');
    }else if(req.session.uid == "finance") {
        let finalJson = {};
        finalJson.username = req.session.uid;
        var queryf = "SELECT generatedbills.CustomerId, generatedbills.month, generatedbills.year, generatedbills.overageUnits, generatedbills.overageUnitPrice, generatedbills.overageAmounts, generatedbills.billId, customers.name, customers.billingaddress, customers.billingemail, customers.monthlimit, customers.overagecost, customers.startMonth, customers.startYear from generatedbills Join customers where generatedbills.CustomerId=customers.CustomerId AND generatedbills.status='notbilled' AND customers.requireApproval='yes';";
        mysql.fetchData(function (err, result1) {
            if(err){
                console.log(err);
            }else{
                var querys = "SELECT generatedbills.CustomerId, generatedbills.month, generatedbills.year, generatedbills.overageUnits, generatedbills.overageUnitPrice, generatedbills.overageAmounts, generatedbills.billId, customers.name, customers.billingaddress, customers.billingemail, customers.monthlimit, customers.overagecost, customers.startMonth, customers.startYear from generatedbills Join customers where generatedbills.CustomerId=customers.CustomerId AND generatedbills.status='sales' AND customers.requireApproval='yes';";
                mysql.fetchData(function (err, result2) {
                    if(err){
                        console.log(err);
                    }else{
                        finalJson.financeBills = result1;
                        finalJson.salesBills = result2;
                        res.send(finalJson);
                    }
                },querys);
            }
        },queryf);
    }else if(req.session.uid == "sales"){
        let finalJson = {};
        finalJson.username = req.session.uid;
        var querys = "SELECT generatedbills.CustomerId, generatedbills.month, generatedbills.year, generatedbills.overageUnits, generatedbills.overageUnitPrice, generatedbills.overageAmounts, generatedbills.billId, customers.name, customers.billingaddress, customers.billingemail, customers.monthlimit, customers.overagecost, customers.startMonth, customers.startYear from generatedbills Join customers where generatedbills.CustomerId=customers.CustomerId AND generatedbills.status='fin' AND customers.requireApproval='yes';";
        mysql.fetchData(function (err, result1) {
            if(err){
                console.log(err);
            }else{
                finalJson.salesBills = result1;
                res.send(finalJson);
            }
        },querys);
    }
};

exports.approve = function (req, res, next) {
    var status= req.param("approve");
    var billId = req.param("billID");
    console.log(status, billId);
    var query = "UPDATE generatedbills SET status='"+status+"' where billId='"+billId+"'";
    console.log(query);
    mysql.fetchData(function (err, result) {
        if(err){
            console.log(err);
        }else{
            if(req.session.uid == "finance" ){
                let finalJson = {};
                finalJson.username = req.session.uid;
                var queryf = "SELECT generatedbills.CustomerId, generatedbills.month, generatedbills.year, generatedbills.overageUnits, generatedbills.overageUnitPrice, generatedbills.overageAmounts, generatedbills.billId, customers.name, customers.billingaddress, customers.billingemail, customers.monthlimit, customers.overagecost, customers.startMonth, customers.startYear from generatedbills Join customers where generatedbills.CustomerId=customers.CustomerId AND generatedbills.status='notbilled' AND customers.requireApproval='yes';";
                mysql.fetchData(function (err, result1) {
                    if(err){
                        console.log(err);
                    }else{
                        var querys = "SELECT generatedbills.CustomerId, generatedbills.month, generatedbills.year, generatedbills.overageUnits, generatedbills.overageUnitPrice, generatedbills.overageAmounts, generatedbills.billId, customers.name, customers.billingaddress, customers.billingemail, customers.monthlimit, customers.overagecost, customers.startMonth, customers.startYear from generatedbills Join customers where generatedbills.CustomerId=customers.CustomerId AND generatedbills.status='sales' AND customers.requireApproval='yes';";
                        mysql.fetchData(function (err, result2) {
                            if(err){
                                console.log(err);
                            }else{
                                finalJson.financeBills = result1;
                                finalJson.salesBills = result2;
                                res.send(finalJson);
                            }
                        },querys);
                    }
                },queryf);
            }else if(req.session.uid == "sales"){
                let finalJson = {};
                finalJson.username = req.session.uid;
                var querys = "SELECT generatedbills.CustomerId, generatedbills.month, generatedbills.year, generatedbills.overageUnits, generatedbills.overageUnitPrice, generatedbills.overageAmounts, generatedbills.billId, customers.name, customers.billingaddress, customers.billingemail, customers.monthlimit, customers.overagecost, customers.startMonth, customers.startYear from generatedbills Join customers where generatedbills.CustomerId=customers.CustomerId AND generatedbills.status='fin' AND customers.requireApproval='yes';";
                mysql.fetchData(function (err, result1) {
                    if(err){
                        console.log(err);
                    }else{
                        finalJson.salesBills = result1;
                        res.send(finalJson);
                    }
                },querys);
            }
        }
    },query);
};

exports.sendBill = function (req, res, next) {
    var totalBill = {
        "from" : req.body.from,
        "bill" : req.body.bill
    }
    let finalJson = {};
    finalJson.username = req.session.uid;
    finalJson.totalBill = totalBill;
    var query = "UPDATE generatedbills SET status='SENT' where billId='"+req.body.bill.billId+"'";
    mysql.fetchData(function (err, result) {
        if(err){
            console.log(err);
        }else{
            var queryf = "SELECT generatedbills.CustomerId, generatedbills.month, generatedbills.year, generatedbills.overageUnits, generatedbills.overageUnitPrice, generatedbills.overageAmounts, generatedbills.billId, customers.name, customers.billingaddress, customers.billingemail, customers.monthlimit, customers.overagecost, customers.startMonth, customers.startYear from generatedbills Join customers where generatedbills.CustomerId=customers.CustomerId AND generatedbills.status='notbilled' AND customers.requireApproval='yes';";
            mysql.fetchData(function (err, result1) {
                if(err){
                    console.log(err);
                }else{
                    var querys = "SELECT generatedbills.CustomerId, generatedbills.month, generatedbills.year, generatedbills.overageUnits, generatedbills.overageUnitPrice, generatedbills.overageAmounts, generatedbills.billId, customers.name, customers.billingaddress, customers.billingemail, customers.monthlimit, customers.overagecost, customers.startMonth, customers.startYear from generatedbills Join customers where generatedbills.CustomerId=customers.CustomerId AND generatedbills.status='sales' AND customers.requireApproval='yes';";
                    mysql.fetchData(function (err, result2) {
                        if(err){
                            console.log(err);
                        }else{
                            finalJson.financeBills = result1;
                            finalJson.salesBills = result2;
                            console.log(finalJson.totalBill);
                            request.post(
                                'https://e69eb0a3-7f25-4043-8ca9-82e25e77fc9e.trayapp.io ',
                                finalJson.totalBill,
                                function (error, response, body) {
                                    if (!error && response.statusCode == 200) {
                                        res.send(finalJson);
                                    }
                                }
                            );

                        }
                    },querys);
                }
            },queryf);
        }
    },query)
};


function convertTime(isend) {
    var totalSec = isend;
    var days =  Math.floor(totalSec / 86400);
    var hours = parseInt( totalSec / 3600 ) % 24;
    var minutes = parseInt( totalSec / 60 ) % 60;
    var seconds = totalSec % 60;
    return days+ " Days "+hours+ ":" +minutes+ ":"+seconds ;
}