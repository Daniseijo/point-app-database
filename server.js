var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    mongoose = require('mongoose');

const ROOT_KEY = '79edc86c9b2930aecdfcf395ffb695a0';

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

mongoose.connect('mongodb://daniseijo:password@ds027338.mlab.com:27338/point-app-database', function(err, res) {
    if (err) throw err;
    console.log('Connected to Database');
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(methodOverride());

var ApplicationModel    = require('./models/Application');
var PlaceModel          = require('./models/Place');
var ElementModel        = require('./models/Element');

var ApplicationCtrl = require('./controllers/Application');
var PlaceCtrl       = require('./controllers/Place');
var ElementCtrl     = require('./controllers/Element');

var router = express.Router();
router.get('/', function(req, res) {
    res.send('Welcome to the API');
});
app.use(router);

var api = express.Router();

function isAuthenticated(req, res, next) {
    var auth = req.get('rootAuth');
    if (auth == ROOT_KEY) {
        return next();
    }
    
    return res.status(401).send('HTTP Error 401 - Unauthorized: Access is denied due to invalid credentials.');
}

// Routes for Application
api.route('/application')
    .all(isAuthenticated)
    .get(ApplicationCtrl.findAllApplications)
    .post(ApplicationCtrl.addApplication);

api.route('/application/beacon/:uuid')
    .all(isAuthenticated)
    .get(ApplicationCtrl.findByUUID);

api.route('/application/:id')
    .all(isAuthenticated)
    .get(ApplicationCtrl.findById)
    .put(ApplicationCtrl.updateApplication)
    .delete(ApplicationCtrl.deleteApplication);

// Routes for Place
api.route('/place')
    .all(isAuthenticated)
    .get(PlaceCtrl.findAllPlaces)
    .post(PlaceCtrl.addPlace);

api.route('/place/beacon/:uuid/:major')
    .all(isAuthenticated)
    .get(PlaceCtrl.findByUUIDMajor);

api.route('/place/beacon/:uuid')
    .all(isAuthenticated)
    .get(PlaceCtrl.findByUUID);

api.route('/place/:id')
    .all(isAuthenticated)
    .get(PlaceCtrl.findById)
    .put(PlaceCtrl.updatePlace)
    .delete(PlaceCtrl.deletePlace);

// Routes for Element
api.route('/element')
    .all(isAuthenticated)
    .get(ElementCtrl.findAllElements)
    .post(ElementCtrl.addElement);

api.route('/element/beacon/:uuid/:major')
    .all(isAuthenticated)
    .get(ElementCtrl.findByUUIDMajor);

api.route('/element/beacon/:uuid/:major/:minor')
    .all(isAuthenticated)
    .get(ElementCtrl.findByUUIDMajorMinor);

api.route('/element/:id')
    .all(isAuthenticated)
    .get(ElementCtrl.findById)
    .put(ElementCtrl.updateElement)
    .delete(ElementCtrl.deleteElement);



app.use('/api', api);

// Start server
app.listen(port, function() {
    console.log("Node server running on http://localhost:8080");
});