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

    state: {
      type: String
    },

    image: {
      type: String,
      default: ''
    },

    //object ID
    created_by:{
      type: mongoose.Schema.Types.ObjectId,
      ref: ProfileModel,
    }
})

let EventModel = mongoose.model('todo', EventSchema)

module.exports = EventModel;