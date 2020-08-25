const mongoose = require('mongoose');

let EventSchema = new mongoose.Schema({
    title:{
    type: String,
    required: true
    },

    description:{
      type: String,
      required: true    
    },

    date:{
      type: String,
      required: true
    },

    image: {
      type: String,
      default: ''
    },

    created_by:{
      type: String
    }
})

let eventModel = mongoose.model('todo', EventSchema)

module.exports = eventModel;