//File: controllers/Element.js
//Author: Daniel Seijo
//Version: 1.0

var mongoose = require('mongoose');
var Element  = mongoose.model('Element');
var Place  = mongoose.model('Place');
var Application = mongoose.model('Application');

//GET - Return all elements in the DB
exports.findAllElements = function(req, res) {
    Element.find(function(err, elements) {
        if(err) return res.status(500).send(err);

        console.log('GET /element')
        res.status(200).jsonp(elements);
    });
};

//GET - Return a Element with specified ID
exports.findById = function(req, res) {
    Element.findById(req.params.id, function(err, element) {
        if(err) return res.status(500).send(err);

        console.log('GET /element/' + req.params.id);
        res.status(200).jsonp(element);
    });
};

//GET - Return all Elements with specified UUID and Major
exports.findByUUIDMajor = function (req, res) {
    Application.findOne({uuid: req.params.uuid}, function(err, application) {
        if(err) return res.status(500).send(err);
        if(!application) return res.status(404).send('Application not found');
        Place.findOne({_application: application._id, major: res.params.major}, function(err1, place) {
            if(err1) return res.status(500).send(err1);
            if(!place) return res.status(404).send('Place not found');
            Element.find({_place: place._id}, function(err2, elements) {
                if(err2) return res.status(500).send(err2);

                console.log('GET /element/beacon/' + req.params.uuid + '/' + req.params.major);
                res.status(200).jsonp(elements);
            });
        });
    });
};

//GET - Return an Element with specified UUID, Major and Minor
exports.findByUUIDMajorMinor = function (req, res) {
    Application.findOne({uuid: req.params.uuid}, function(err, application) {
        if(err) return res.status(500).send(err);
        if(!application) return res.status(404).send('Application not found');
        Place.findOne({_application: application._id, major: req.params.major}, function(err1, place) {
            if(err1) return res.status(500).send(err1);
            if(!place) return res.status(404).send('Place not found');
            Element.findOne({_place: place._id, minor: req.params.minor})
            .populate('_place')
            .exec(function(err, element) {
                if (err) return res.status(500).send(err);
                console.log(element);
                Element.populate(element, {
                    path: '_place._application',
                    model: 'Application'
                },
                function(err, elementPopulate) {
                    if(err) return res.status(500).send(err);
                    if(!elementPopulate) return res.status(404).send('Element not found');

                    console.log('GET /element/beacon/' + req.params.uuid + '/' + req.params.major + '/' + req.params.minor);
                    res.status(200).jsonp(elementPopulate);
                });
            });
        });
    });
};

//POST - Insert a new Element in the DB
exports.addElement = function(req, res) {
    console.log('POST');
    console.log(req.body);

    var element = new Element({
        name:           req.body.name,
        description:    req.body.description,
        _place:         req.body._place,
        minor:          req.body.minor 
    });

    element.save(function(err, element) {
        if(err) return res.status(500).send(err);
        res.status(200).jsonp(element);
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
exports.updateElement = function(req, res) {
    Element.findById(req.params.id, function(err, element) {
        element.name        = req.body.name,
        element.description = req.body.description,
        element._place      = req.body._place,
        element.minor       = req.body.minor

        place.save(function(err) {
            if(err) return res.status(500).send(err);
            res.status(200).jsonp(place);
        });
    });
};

//DELETE - Delete an Element with specified ID
exports.deleteElement = function(req, res) {
    Element.findById(req.params.id, function(err, element) {
        element.remove(function(err) {
            if(err) return res.status(500).send(err);
            res.status(200);
        });
    });
};