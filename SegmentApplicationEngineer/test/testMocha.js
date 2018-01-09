/**
 * Created by shalin on 10/15/2016.
 */
var express = require('express');
var request = require('request');
var assert = require('assert');
var http = require('http');
var mocha = require('mocha');


describe('http API tests', function () {

       it('statusCode 200 for home page', function (done) {
           http.get('http://localhost:3000/', function (res) {
               assert.equal(200, res.statusCode);
               done();
           });
       });

       it('statusCode 200 for bid place', function (done) {
           http.get('http://localhost:3000/placeBid', function (res) {
                assert.equal(200, res.statusCode);
                done();
           });
       });

       it('statusCode 200 for checkout page', function (done) {
           http.get('http://localhost:3000/checkout', function (res) {
                assert.equal(200, res.statusCode);
                done();
           });
       });

       it('statusCode 200 for profile page', function (done) {
            http.get('http://localhost:3000/profile', function (res) {
                assert.equal(200, res.statusCode);
                done();
            });
       });

       it('status code 200 for search API call', function (done) {
             http.get('http://localhost:3000/search', function (res) {
                assert.equal(200, res.statusCode);
                done();
             });
       });

       it('log in successful if password and username is correct', function (done) {
           request.post('http://localhost:3000/login', {form:{username: 'shaalinn',password: 'asd'}},
            function (error, response, body) {
                assert.equal(200, response.statusCode);
                done();
            });
       })
});