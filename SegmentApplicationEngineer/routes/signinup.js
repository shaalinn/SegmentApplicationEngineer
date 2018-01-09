var ejs = require('ejs');
var bcrypt = require('bcrypt-nodejs');
var mysql = require('./mysql');

exports.loginpage = function (req, res, next) {
    res.render('signinup');
};

exports.signout = function (req, res, next) {
    var logintime = getDateTime();
    console.log(logintime);
    req.session.destroy();
    res.render('signinup');
}

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;

}

/*exports.login = function (req, res, next) {


    var username = req.param("username");
    var password = req.param("password");
    console.log(username, password);
    if(username != null && password != null){
        var loginQuery = "SELECT username,u_id,password from ebay.user_info WHERE username='"+username+"';";
            mysql.fetchData(function (err,results) {
                if(err){
                    console.log(err);
                }else if(results.length>0){
                    if(bcrypt.compareSync(password, results[0].password)){
                        console.log("true");
                        req.session.username = results[0].username;
                        req.session.uid = results[0].u_id;
                        console.log(req.session.uid);
                        setTimeout(function(){userLogs.insertLog("userID: "+req.session.uid+" logged in");},0);
                        res.send("valid");
                    }else{
                        res.send("invalid");
                    }
                }else if(results.length == 0){
                    res.send("invalid");
                }
            }, loginQuery);


    }

}*/

exports.login = function (req, res, next) {


    var username = req.param("username");
    var password = req.param("password");
    console.log(username, password);
    if(username != null && password != null){
        if(username == "finadmin" && password == "finpassword"){
            req.session.username = username;
            req.session.uid = "finance";
            console.log(req.session.uid);
            res.send("valid");
        }else if(username == "salesadmin" && password == "salespassword"){
            req.session.username = username;
            req.session.uid = "sales";
            console.log(req.session.uid);
            res.send("valid");
        }else{
            res.send("invalid");
        }
    }else{
        res.send("invalid");
    }

}

exports.register = function(req, res, next) {
    var fn = req.param("fn");
    var ln = req.param("ln");
    var username = req.param("username");
    var email = req.param("email");
    var phno = Number(req.param("phno"));
    var password = req.param("password");
    var bdate = req.param("bdate");
    var addr = req.param("addr");
    var city = req.param("city");
    var state = req.param("state");
    console.log(fn, ln, username, email, phno, password, bdate);
    if(username != null && password != null){
        console.log("inside if");
        var hash = bcrypt.hashSync(password);
        console.log(hash);
        var query = "INSERT into ebay.user_info (username, email, phno, bdate, fname, lname, password, addr, city, state) VALUES ('"+username+"','"+email+"','"+phno+"','"+bdate+"','"+fn+"','"+ln+"','"+hash+"','"+addr+"','"+city+"','"+state+"');";

        console.log(query);
        mysql.storeData(function (err, result) {
            if(err){
                throw err;
            }else if (result != null){
                setTimeout(function(){userLogs.insertLog("user: "+username+" user registered");},0);
                res.send("done");
            }
        },query);
    }
};

exports.checkuser = function (req, res, next) {

    var username = req.param("username");
    var query = "SELECT username FROM user_info WHERE username='"+username+"';";
    mysql.fetchData(function (err,results) {
        if(err){
            console.log(err);
        }else if(results.length>0){
                res.send("unavailable");
        }else if(results.length == 0){
            res.send("available");
        }
    }, query);
}