//File: controllers/Application.js
//Author: Daniel Seijo
//Version: 1.0

var mongoose = require('mongoose');
var Application  = mongoose.model('Application');

//GET - Return all applications in the DB
exports.findAllApplications = function(req, res) {
    Application.find(function(err, applications) {
        if(err) return res.status(500).send(err);

        console.log('GET /application')
        res.status(200).jsonp(applications);
    });
};

//GET - Return an Application with specified ID
exports.findById = function(req, res) {
    Application.findById(req.params.id, function(err, application) {
        if(err) return res.status(500).send(err);

        console.log('GET /application/' + req.params.id);
        res.status(200).jsonp(application);
    });
};

//GET - Return an Application with specified UUID
exports.findByUUID = function(req, res) {
    Application.findOne({uuid: req.params.uuid}, function(err, application) {
        if(err) return res.status(500).send(err);

        console.log('GET /application/beacon/' + req.params.uuid);
        res.status(200).jsonp(application);
    });
};

//POST - Insert a new Application in the DB
exports.addApplication = function(req, res) {
    console.log('POST');
    console.log(req.body);

    var application = new Application({
        name:           req.body.name,
        description:    req.body.description,
        uuid:           req.body.uuid
    });

    application.save(function(err, application) {
        if(err) return res.status(500).send(err);
        res.status(200).jsonp(application);
    });
};

//PUT - Update a register that already exists
exports.updateApplication = function(req, res) {
    Application.findById(req.params.id, function(err, application) {
        application.name        = req.body.name,
        application.description = req.body.description,
        application.uuid        = req.body.uuid

        application.save(function(err) {
            if(err) return res.status(500).send(err);
            res.status(200).jsonp(application);
        });
    });
};

//DELETE - Delete an Application with specified ID
exports.deleteApplication = function(req, res) {
    Application.findById(req.params.id, function(err, application) {
        application.remove(function(err) {
            if(err) return res.status(500).send(err);
            res.status(200);
        });
    });
};