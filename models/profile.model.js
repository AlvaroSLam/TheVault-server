const mongoose = require('mongoose');

let ProfileSchema = new mongoose.Schema(
  {
    username:{
      type: String,
      required: true
    },

    secondname:{
      type: String,
      required: true
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

    wantToLearn_keywords: [{
      type: String
    }],

    teach_keywords: [{
      type: String
    }],

    joinEvents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: EventModel,
    }],

    favVault: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: VaultModel

    }],

    follow: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: ProfileModel

    }],
},
  {
  timestamps: true
  }

)

ProfileSchema.index({ 'email': 1}, {unique: true});
ProfileSchema.index({ 'username': 1}, {unique: true});
module.exports = model('User', userSchema);

let ProfileModel = mongoose.model('User', ProfileSchema)

module.exports = ProfileModel;


