//File: controllers/Place.js
//Author: Daniel Seijo
//Version: 1.0

var mongoose = require('mongoose');
var Place  = mongoose.model('Place');
var Application = mongoose.model('Application');

// //GET - Return all applications in the DB
// exports.findAllPlaces = function(req, res) {
//     Place.find(function(err, places) {
//         if(err) return res.status(500).send(err);

//         console.log('GET /place')
//         res.status(200).jsonp(places);
//     });
// };

// //GET - Return an Application with specified ID
// exports.findById = function(req, res) {
//     Place.findById(req.params.id, function(err, place) {
//         if(err) return res.status(500).send(err);

//         console.log('GET /place/' + req.params.id);
//         res.status(200).jsonp(place);
//     });
// };

exports.findByBeacon = function (req, res) {
    Application.findOne({uuid: req.params.uuid}, function(err, application) {
        if(err) return res.status(500).send(err);
        if(!application) return res.status(404).send('Application not found');
        Place.findOne({_application: application._id, major: req.params.major}, function(err1, place) {
            if(err1) return res.status(500).send(err1);
            if(!place) return res.status(404).send('Place not found');
            console.log('GET /place/' + req.params.uuid + ',' + req.params.major);
            res.status(200).jsonp(place);
        });
    });
}

//POST - Insert a new Application in the DB
exports.addPlace = function(req, res) {
    console.log('POST');
    console.log(req.body);
    Application.findOne({uuid: req.body.uuid}, function(err, application) {
        if(err) return res.status(500).send(err);
        if(!application) return res.status(404).send('UUID does not match any existing Application.');
        var place = new Place({
            name:          req.body.name,
            description:   req.body.description,
            _application:  application._id,
            major:         req.body.major 
        });

        place.save(function(err, place) {
            if(err) return res.status(500).send(err);
            res.status(200).jsonp(place);
        });
    });
};

// //PUT - Update a register already exists
// exports.updateApplication = function(req, res) {
//     Application.findById(req.params.id, function(err, application) {
//         application.name        = req.body.name,
//         application.uuid        = req.body.uuid,
//         application.description = req.body.description

//         application.save(function(err) {
//             if(err) return res.status(500).send(err);
//             res.status(200).jsonp(application);
//         });
//     });
// };

// //DELETE - Delete a Application with specified ID
// exports.deleteApplication = function(req, res) {
//     Application.findById(req.params.id, function(err, application) {
//         application.remove(function(err) {
//             if(err) return res.status(500).send(err);
//             res.status(200);
//         });
//     });
// };