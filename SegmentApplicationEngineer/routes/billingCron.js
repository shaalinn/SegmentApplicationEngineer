/**
 * Created by shalin on 1/8/2018.
 */
var express = require('express');
var router = express.Router();
var ejs = require('ejs');
var bcrypt = require('bcrypt-nodejs');
var mysql = require('./mysql');
var cron = require('node-cron');

cron.schedule('*/1 * * * *', function (req, res, next) {

    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var fetchAllAPIUsage = "SELECT apiusage.month, apiusage.year, apiusage.apiUsage, apiusage.apiusageId, customers.CustomerId, customers.name, customers.billingaddress, customers.billingemail, customers.monthlimit, customers.startMonth, customers.startYear, customers.overagecost from apiusage join customers on apiUsage.CustomerId=customers.CustomerId where ( ((apiusage.year=customers.startYear) AND (apiUsage.month-customers.startMonth>=3)) OR ((apiusage.year-customers.startYear=1) AND (customers.startMonth-apiUsage.month<=9)) OR (apiusage.year-customers.startYear>1) ) AND apiUsage.billed='no';";
    mysql.fetchData(function (err, result1) {
        if (err) {
            console.log(err);
        } else if (result1 != null) {
            for (let i = 0; i < result1.length; i++) {
                console.log("inside for loop",result1.length);
                let overageUnits = result1[i].apiUsage - result1[i].monthlimit;
                let overageUnitPrice = result1[i].overagecost;
                let overageAmounts = overageUnits*overageUnitPrice;
                let amonth = result1[i].month;
                let ayear = result1[i].year;
                let customerId = result1[i].CustomerId;
                let apiUsageId = result1[i].apiusageId;
                let overageBillQuery = "INSERT into generatedbills (CustomerId,month,year,status,overageUnits,overageUnitPrice,overageAmounts) VALUES ('"+customerId+"','"+amonth+"','"+ayear+"','notbilled','"+overageUnits+"','"+overageUnitPrice+"','"+overageAmounts+"')";
                let billedStatus = "UPDATE apiUsage SET billed='yes' where apiusageId='"+apiUsageId+"'";
                mysql.fetchData(function (err, result2) {
                    if (err) {
                        console.log(err);
                    } else if (result2 != null) {
                        //console.log("customer id "+ result1[i].CustomerId);
                        mysql.storeData(function (err, result3) {
                            if (err) {
                                console.log(err);
                            }
                            else if (result3 != null) {
                                //console.log("BILL ADDED ",result1[i].apiusageId)
                            }
                        }, billedStatus);
                    }
                }, overageBillQuery);
            }
        }
    }, fetchAllAPIUsage);

});