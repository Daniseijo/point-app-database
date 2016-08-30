//File: models/Place.js
//Author: Daniel Seijo
//Version: 1.0

// Module dependencies
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Validation
function validateLength (v) {
  return v.length <= 15;
}

// Place Schema
var PlaceSchema = new mongoose.Schema({
    created: {
        type: Date,
        default: Date.now 
    },
    name: {
        type: String,
        default: '',
        trim: true,     
        unique : true,
        required: 'Name cannot be blank',
        validate: [validateLength, 'Name must be 15 chars in length or less']
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    image: {
        type: String,
        default: '',
        trim: true
    },
    color: {
        type: Number,
        default: 0xFFFFFF
    },
    _application: {
        type: Schema.ObjectId,
        ref: 'Application',
        required: 'You need to link the place to an application'
    },
    major: {
        type: Number,
        min: 0,
        max: 65535,
        required: 'You need a Major identifier'
    }
});

PlaceSchema.index({_application: 1, major: 1}, {unique: true});

mongoose.model('Place', PlaceSchema);