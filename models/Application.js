//File: models/Application.js
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
var ApplicationSchema = new mongoose.Schema({
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
    uuid: {
        type: String,
        default: '',
        unique : true,
        validate: {
            validator: function(v) {
                return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
            },
            message: '{VALUE} is not a valid UUID'
        },
        required: 'UUID cannot be blank'
    }
});

mongoose.model('Application', ApplicationSchema);