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

    //URL Cloudinary
    fileUrl: {
      type: String,
      default: ''
    },

    created_by:{
      type: mongoose.Schema.Types.ObjectId,
      ref: ProfileModel,
    }
})

let VaultModel = mongoose.model('todo', VaultSchema)

module.exports = VaultModel;