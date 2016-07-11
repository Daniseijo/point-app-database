//File: controllers/Place.js
//Author: Daniel Seijo
//Version: 1.0

var mongoose = require('mongoose');
var Place  = mongoose.model('Place');
var Application = mongoose.model('Application');

//GET - Return all places in the DB
exports.findAllPlaces = function(req, res) {
    Place.find(function(err, places) {
        if(err) return res.status(500).send(err);

        console.log('GET /place')
        res.status(200).jsonp(places);
    });
};

//GET - Return a Place with specified ID
exports.findById = function(req, res) {
    Place.findById(req.params.id, function(err, place) {
        if(err) return res.status(500).send(err);

        console.log('GET /place/' + req.params.id);
        res.status(200).jsonp(place);
    });
};

//GET - Return all Places with specified UUID
exports.findByUUID = function (req, res) {
    Application.findOne({uuid: req.params.uuid}, function(err, application) {
        if(err) return res.status(500).send(err);
        if(!application) return res.status(404).send('Application not found');
        Place.find({_application: application._id}, function(err1, places) {
            if(err1) return res.status(500).send(err1);
            console.log('GET /place/beacon/' + req.params.uuid);
            res.status(200).jsonp(places);
        });
    });
};

//GET - Return a Place with specified UUID and Major
exports.findByUUIDMajor = function (req, res) {
    Application.findOne({uuid: req.params.uuid}, function(err, application) {
        if(err) return res.status(500).send(err);
        if(!application) return res.status(404).send('Application not found');
        Place.findOne({_application: application._id, major: req.params.major}
        .populate('_application')
        .exec(function(err, place) {
            if(err) return res.status(500).send(err);
            if(!place) return res.status(404).send('Place not found');
            console.log('GET /place/beacon/' + req.params.uuid + '/' + req.params.major);
            res.status(200).jsonp(place);
        });
    });
};

//POST - Insert a new Place in the DB
exports.addPlace = function(req, res) {
    console.log('POST');
    console.log(req.body);

    var place = new Place({
        name:           req.body.name,
        description:    req.body.description,
        _application:   req.body._application,
        major:          req.body.major 
    });

    place.save(function(err, place) {
        if(err) return res.status(500).send(err);
        res.status(200).jsonp(place);
    });
};

// //POST - Insert a new Place in the DB
// exports.addPlace = function(req, res) {
//     console.log('POST');
//     console.log(req.body);
//     Application.findOne({uuid: req.body.uuid}, function(err, application) {
//         if(err) return res.status(500).send(err);
//         if(!application) return res.status(404).send('UUID does not match any existing Application.');
//         var place = new Place({
//             name:          req.body.name,
//             description:   req.body.description,
//             _application:  application._id,
//             major:         req.body.major 
//         });

//         place.save(function(err, place) {
//             if(err) return res.status(500).send(err);
//             res.status(200).jsonp(place);
//         });
//     });
// };

//PUT - Update a register that already exists
exports.updatePlace = function(req, res) {
    Place.findById(req.params.id, function(err, place) {
        place.name          = req.body.name,
        place.description   = req.body.description,
        place._application  = req.body._application,
        place.major         = req.body.major

        place.save(function(err) {
            if(err) return res.status(500).send(err);
            res.status(200).jsonp(place);
        });
    });
};

//DELETE - Delete a Place with specified ID
exports.deletePlace = function(req, res) {
    Place.findById(req.params.id, function(err, place) {
        place.remove(function(err) {
            if(err) return res.status(500).send(err);
            res.status(200);
        });
    });
};