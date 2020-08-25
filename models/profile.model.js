const mongoose = require('mongoose');

let ProfileSchema = new mongoose.Schema({
    username:{
      type: String,
      required: true
    },

    secondname:{
      type: String,
      required: true
    },

    mail: {
      type: String,
      required: true,
      unique: true
    },

    description:{
      type: String
    },

    image: {
      type: String,
      default: ''
    },

    learn_keywords: [{
      type: String
    }],

    teach_keywords: [{
      type: String
    }],

    events: {
      type: String
    },

    vault: {
      type: String
    },

    follow: {
      type: String
    },
})

let profileModel = mongoose.model('todo', ProfileSchema)

module.exports = profileModel;


