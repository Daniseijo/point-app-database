//File: models/Place.js
//Author: Daniel Seijo
//Version: 1.0

// Validation
function validateLength (v) {
  return v.length <= 15;
}

// Place Schema
exports = module.exports = function(app, mongoose) {

    var PlaceSchema = new mongoose.Schema({
        name: {
            type: String,
            default: '',
            trim: true,     
            unique : true,
            required: 'name cannot be blank',
            validate: [validateLength, 'Name must be 15 chars in length or less']
        },
        description: {
            type: String,
            default: '',
            trim: true
        },
        created: {
            type: Date,
            default: Date.now 
        }
    });
    
    mongoose.model('Place', PlaceSchema);

};