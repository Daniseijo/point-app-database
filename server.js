var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    mongoose = require('mongoose');

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

// Routes for Application
api.route('/application')
    .get(ApplicationCtrl.findAllApplications)
    .post(ApplicationCtrl.addApplication);

api.route('/application/beacon/:uuid')
    .get(ApplicationCtrl.findByUUID);

api.route('/application/:id')
    .get(ApplicationCtrl.findById)
    .put(ApplicationCtrl.updateApplication)
    .delete(ApplicationCtrl.deleteApplication);

// Routes for Place
api.route('/place')
    .get(PlaceCtrl.findAllPlaces)
    .post(PlaceCtrl.addPlace);

api.route('/place/beacon/:uuid/:major')
    .get(PlaceCtrl.findByUUIDMajor);

api.route('/place/beacon/:uuid')
    .get(PlaceCtrl.findByUUID);

api.route('/place/:id')
    .get(PlaceCtrl.findById)
    .put(PlaceCtrl.updatePlace)
    .delete(PlaceCtrl.deletePlace);

// Routes for Element
api.route('/element')
    .get(ElementCtrl.findAllElements)
    .post(ElementCtrl.addElement);

api.route('/element/beacon/:uuid/:major')
    .get(ElementCtrl.findByUUIDMajor);

api.route('/element/beacon/:uuid/:major/:minor')
    .get(ElementCtrl.findByUUIDMajorMinor);

api.route('/element/:id')
    .get(ElementCtrl.findById)
    .put(ElementCtrl.updateElement)
    .delete(ElementCtrl.deleteElement);



app.use('/api', api);

// Start server
app.listen(3000, function() {
    console.log("Node server running on http://localhost:3000");
});