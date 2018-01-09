
var header = angular.module('indexBody', []);
header.controller('indexBody', function ($scope, $http, $window) {

        $http({
            method: "GET",
            url: '/data'
        }).success(function (result) {
            console.log(result);
            $scope.username = result.username;
            $scope.finBill = result.financeBills;
            $scope.saleBill = result.salesBills;
        },function (err) {
            console.log("error occurred: "+err);
        });

    $scope.Approve = function (status,id) {
        console.log(id);
        $http({
            method: "GET",
            url: "/approve",
            params: {
                billID: id,
                approve:status
            }
        }).success(function (result) {
            console.log(result);
            $scope.username = result.username;
            $scope.finBill = result.financeBills;
            $scope.saleBill = result.salesBills;
        },function (err) {
            console.log(err);
        });
    };

    $scope.Waive = function (id) {
        console.log(id);
        $http({
            method: "GET",
            url: "/approve",
            params: {
                billID: id,
                approve:"waived"
            }
        }).success(function (result) {
            console.log(result);
            $scope.username = result.username;
            $scope.finBill = result.financeBills;
            $scope.saleBill = result.salesBills;
        },function (err) {
            console.log(err);
        });
    };

    $scope.sendBill = function (bill) {
        var reqBody = { bill: bill,
                        from :"shalindashrathbhhai.amin@sjsu.edu"
                      };
        $http.post("/sendBill", reqBody
        ).success(function (result) {
            console.log(result);
            $scope.username = result.username;
            $scope.finBill = result.financeBills;
            $scope.saleBill = result.salesBills;
            console.log(result.totalBill)
        },function (err) {
            console.log(err);
        });
    };

        /*$http({
            method: "GET",
            url: '/productList'
        }).success(function (result) {
            console.log(result);
            $scope.products = result;
        }), function (err) {
            console.log(err);
        }*/

    /*$scope.search = function () {
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
    };*/

});