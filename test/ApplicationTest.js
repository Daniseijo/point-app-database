// Requires
var should = require('should'),
    express = require('express'),
    app = express(),
    mongoose = require('mongoose');

// Database connection
mongoose.connect('mongodb://daniseijo:password@ds027338.mlab.com:27338/point-app-database/application', function(err, res) {
    if (err) {
        console.log('Remember to launch mongodb in another terminal');
        throw err;
    }
});

// Added model and created Schema
var modelApplication = require('../models/Application');
var Application  = mongoose.model('Application');

// Asserts
describe('Application Model', function() {

    describe('Saving', function() {
        it('saves new record', function(done) {
            var application = new Application({
                name: 'Beverages',
                uuid: 'F8C1FB17-AFD4-4AB6-BF2F-B0E5AE6DDE6D',
                description: 'Soft drinks, coffees, teas, beers, and ales'
            });

            application.save(function(err, saved) {
                should.not.exist(err);
                done();
            });
        });

        it('throws validation error when name is empty', function(done) {   
            var application = new Application({
                uuid: 'F8C1FB17-AFD4-4AB6-BF2F-B0E5AE6DDE6D',
                description: 'Soft drinks, coffees, teas, beers, and ales'
            });

            application.save(function(err) {
                should.exist(err);
                err.errors.name.message.should.equal('Name cannot be blank');
                done();
            });
        });

        it('throws validation error when name longer than 15 chars', function(done) {
            var application = new Application({
                name: 'Grains/Cereals/Chocolates',
                uuid: 'F8C1FB17-AFD4-4AB6-BF2F-B0E5AE6DDE6D'
            });

            application.save(function(err, saved) {
                should.exist(err);
                err.errors.name.message.should.equal('Name must be 15 chars in length or less');
                done();
            });
        });

        it('throws validation error for duplicate application name', function(done) {
            var application = new Application({
                name: 'Beverages',
                uuid: 'F8C1FB17-AFD4-4AB6-BF2F-B0E5AE6DDE6D',
            });

            application.save(function(err) {
                should.not.exist(err);

                var duplicate = new Application({
                    name: 'Beverages',
                    uuid: 'F8C1FB17-AFD4-4AB6-BF2F-B0E5AE6DDE6D',
                });

                duplicate.save(function(err) {
                    err.message.indexOf('Beverages').should.not.equal(-1);
                    err.message.indexOf('duplicate key error').should.not.equal(-1);
                    should.exist(err);
                    done();
                });
            });
        });

        it('throws validation error when uuid is not correctly formated', function(done) {
            var application = new Application({
                name: 'Beverages',
                uuid: 'F8C1FB1-AFD4-4AB6-BF2F-B0E5AE6DDE6D'
            });

            application.save(function(err, saved) {
                should.exist(err);
                err.errors.uuid.message.should.equal('F8C1FB1-AFD4-4AB6-BF2F-B0E5AE6DDE6D is not a valid UUID');
                done();
            });
        });
    });

    afterEach(function(done) { 
        // NB this deletes ALL categories (but is run against a test database)
        Application.remove().exec();
        done();
    });
});