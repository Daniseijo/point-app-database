// Requires
var should = require('should'),
    express = require('express'),
    app = express(),
    mongoose = require('mongoose');

// Added model and created Schema
var modelPlace = require('../models/Place');
var modelApplication = require ('../models/Application');

var Place  = mongoose.model('Place');
var Application  = mongoose.model('Application');

var application, place;

// Asserts
describe('Place Model', function() {

    beforeEach(function (done) {
        application = new Application({
            name: 'Beverages',
            uuid: 'F8C1FB17-AFD4-4AB6-BF2F-B0E5AE6DDE6D',
            description: 'Soft drinks, coffees, teas, beers, and ales'
        });

        application.save(function () {
            place = new Place({
                name: 'Beverages',
                description: 'Soft drinks, coffees, teas, beers, and ales',
                application: application,
                major: 1
            });

            done();
        });
    });

    describe('Saving', function() {
        it('saves new record', function(done) {
            place.save(function(err, saved) {
                should.not.exist(err);
                done();
            });
        });

        // it('throws validation error when name is empty', function(done) {   
        //     var place = new Place({
        //         description: 'Soft drinks, coffees, teas, beers, and ales'
        //     });

        //     place.save(function(err) {
        //         should.exist(err);
        //         err.errors.name.message.should.equal('Name cannot be blank');
        //         done();
        //     });
        // });

        // it('throws validation error when name longer than 15 chars', function(done) {
        //     var place = new Place({
        //         name: 'Grains/Cereals/Chocolates'
        //     });

        //     place.save(function(err, saved) {
        //         should.exist(err);
        //         err.errors.name.message.should.equal('Name must be 15 chars in length or less');
        //         done();
        //     });
        // });

        it('throws validation error for duplicate place name', function(done) {
            place.save(function(err) {
                should.not.exist(err);

                var duplicate = new Place({
                    name: 'Comedor',
                    description: 'Soft drinks, coffees, teas, beers, and ales',
                    application: application,
                    major: 1
                });

                duplicate.save(function(err) {
                    console.log(err);
                    err.message.indexOf('Beverages').should.not.equal(-1);
                    err.message.indexOf('duplicate key error').should.not.equal(-1);
                    should.exist(err);
                    done();
                });
            });
        });
    });

    afterEach(function (done) {
        Place.remove().exec(function () {
            Application.remove().exec(done);
        });
    });
});