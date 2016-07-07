// Requires
var should = require('should'),
    express = require('express'),
    app = express(),
    mongoose = require('mongoose');

// Database connection
mongoose.connect('mongodb://daniseijo:password@ds019143.mlab.com:19143/app_pfc_database/place', function(err, res) {
    if (err) {
        console.log('Remember to launch mongodb in another terminal');
        throw err;
    } else console.log('Connected to Database');
});

// Added model and created Schema
var models = require('../models/Place')(app, mongoose);
var Place  = mongoose.model('Place');

// Asserts
describe('Place Model', function() {

    describe('Saving', function() {
        it('saves new record', function(done) {
            var place = new Place({
                name: 'Beverages',
                description: 'Soft drinks, coffees, teas, beers, and ales'
            });

            place.save(function(err, saved) {
                should.not.exist(err);
                done();
            });
        });

        it('throws validation error when name is empty', function(done) {   
            var place = new Place({
                description: 'Soft drinks, coffees, teas, beers, and ales'
            });

            place.save(function(err) {
                should.exist(err);
                err.errors.name.message.should.equal('name cannot be blank');
                done();
            });
        });

        it('throws validation error when name longer than 15 chars', function(done) {
            var place = new Place({
                name: 'Grains/Cereals/Chocolates'
            });

            place.save(function(err, saved) {
                should.exist(err);
                err.errors.name.message.should.equal('Name must be 15 chars in length or less');
                done();
            });
        });

        it('throws validation error for duplicate place name', function(done) {
            var place = new Place({
                name: 'Beverages'
            });

            place.save(function(err) {
                should.not.exist(err);

                var duplicate = new Place({
                    name: 'Beverages'
                });

                duplicate.save(function(err) {
                    err.message.indexOf('Beverages').should.not.equal(-1);
                    err.message.indexOf('duplicate key error').should.not.equal(-1);
                    should.exist(err);
                    done();
                });
            });
        });
    });

    afterEach(function(done) { 
        // NB this deletes ALL categories (but is run against a test database)
        Place.remove().exec();
        done();
    });
});