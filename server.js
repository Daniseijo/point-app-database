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
// var PlaceCtrl       = require('./controllers/tvshows');
// var ElementCtrl     = require('./controllers/tvshows');

var router = express.Router();
router.get('/', function(req, res) {
	res.send('Welcome to the API');
});
app.use(router);

var application = express.Router();

application.route('/application')
  .get(ApplicationCtrl.findAllApplications)
  .post(ApplicationCtrl.addApplication);

application.route('/application/:id')
  .get(ApplicationCtrl.findById)
  .put(ApplicationCtrl.updateApplication)
  .delete(ApplicationCtrl.deleteApplication);

app.use('/api', application);

// Start server
app.listen(3000, function() {
  console.log("Node server running on http://localhost:3000");
});

