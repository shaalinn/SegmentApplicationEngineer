
var header = angular.module('header', []);
header.controller('header', function ($scope, $http) {

    $scope.userData = function () {

        $http({
            method: "GET",
            url: "/userData",
        }).success(function (result) {
            $scope.username = result.username;
        },function (err) {
            console.log("error occurred: "+err);
        });

    }

    $scope.search = function () {
        $http({
            method: "GET",
            url: "/search",
            params: {
                searchQ: $scope.searchQ
            }
        }).success(function (results) {
                $scope.products = results;
        },function (err) {
            console.log(err);
        });
    };
});