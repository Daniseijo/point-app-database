//File: models/Element.js
//Author: Daniel Seijo
//Version: 1.0

// Module dependencies
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Validation
function validateLength (v) {
  return v.length <= 20;
}

// Element Schema
var ElementSchema = new Schema({
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
        validate: [validateLength, 'Name must be 20 chars in length or less']
    },
    description: {
        type: Object,
        set: function(data) {
            try {
                return JSON.parse(data);
            }catch (error) {
                return data;
            }
        },
        default: '',
        trim: true
    },
    type: {
        type: String,
        enum : ['normal','timetable'],
        default: 'normal'
    },
    image: {
        type: String,
        default: '',
        trim: true
    },
    _place: {
        type: Schema.ObjectId,
        ref: 'Place',
        required: 'You need to link the element to a place'
    },
    minor: {
        type: Number, 
        min: 0, 
        max: 65535, 
        required: 'You need a Minor identifier'
    }
});

ElementSchema.index({_place: 1, minor: 1}, {unique: true});

mongoose.model('Element', ElementSchema);