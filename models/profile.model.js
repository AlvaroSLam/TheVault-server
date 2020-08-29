const mongoose = require('mongoose');

let ProfileSchema = new mongoose.Schema(
  {
    username:{
      type: String,
      required: true
    },

    secondname:{
      type: String,
    },

    email: {
      type: String,
      required: true,
      unique: true
    },
    
    passwordHash: {
      type: String,
      required: true
    },

    description:{
      type: String
    },

    image: {
      type: String,
      default: ''
    },

    wantToLearns: [{
      type: String
    }],

    howToKnows: [{
      type: String
    }],

    joinEvents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event"
    }],

    favVault: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vault"

    }],

    follow: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"

    }],
},
  {
  timestamps: true
  }

)

ProfileSchema.index({ 'email': 1}, {unique: true});
ProfileSchema.index({ 'username': 1}, {unique: true});
module.exports = mongoose.model('user', ProfileSchema);


