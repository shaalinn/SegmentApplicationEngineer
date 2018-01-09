
var signinup = angular.module('signinup', []);
signinup.controller('signs',function ($scope, $http, $window) {


    $scope.rocker = false;
    $scope.register = function () {
        $http({
            method: "POST",
            url: '/register',
            params: {
                fn: $scope.fn,
                ln: $scope.ln,
                username: $scope.username,
                email: $scope.email,
                password: $scope.password,
                phno: $scope.phno,
                bdate: $scope.bdate,
                addr: $scope.addr,
                city: $scope.city,
                state: $scope.state

            }
        }).success(function (result) {
            $window.location.assign('/signinup');
        },function (err) {
            console.log(err);
            window.location.assign('/signinup');
        });
    };

    $scope.login = function () {
        $http({
            method: "POST",
            url: '/login',
            params:{
                username: $scope.username,
                password: $scope.password
            }
        }).success(function (result) {
            if(result == "valid"){
                $window.location.href = '/';
            }else if(result == "invalid"){
                $scope.rocker = true;
            }

        },function (err) {
            window.location.assign('/signinup');
        });

    };

    $scope.checkUser = function () {
        $http({
            method: "GET",
            url: '/checkuser',
            params:{
                username: $scope.username
            }
        }).success(function (result) {
            if(result == "available"){
                $scope.rocker2 = false;
                $scope.rocker3 = true;
            }else if(result == "unavailable"){
                $scope.rocker2 = true;
                $scope.rocker3 = false;
            }
        },function (err) {
            window.location.assign('/signinup');
        });
    };

    $scope.check = function () {
        if($scope.password != $scope.cpassword){
            $scope.rocker5 = true;
            $scope.rocker3 = false;
        }else{
            $scope.rocker5 = false;
            $scope.rocker3 = true;
        }
    }
    
});
