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
    keywords:[{
      type:String,
      default:'#general'
    }],
    //object ID
    created_by:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
})

let EventModel = mongoose.model('Event', EventSchema)

module.exports = EventModel;