const mongoose = require('mongoose');

let VaultSchema = new mongoose.Schema({
    title:{
    type: String,
    required: true
    },

    description:{
      type: String,
      required: true    
    },

    fileType:{
      type: String,
      enum: ["Video", "Img", "Text", "Audio"]
    },

    fileData: {
      type: String,
      default: ''
    },

    created_by:{
      type: String
    }
})

let vaultModel = mongoose.model('todo', VaultSchema)

module.exports = vaultModel;