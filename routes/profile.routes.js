const express = require('express')
const router = express.Router()
const { isLoggedIn } = require('../helpers/auth-helper'); // to check if user is loggedIn
const ProfileModel = require('../models/profile.model');



router.get("/profile", isLoggedIn, (req, res, next) => {
     ProfileModel.findById(req.session.loggedInUser._id)
     .then((response) => {
          res.status(200).json(response)
     })
     .catch((err) => {
          console.log(err)
          res.status(500).json({
               error: 'Something went wrong',
               message: err
          })
     })
   });

router.patch('/profile/edit', isLoggedIn, (req, res) => {
     
     const {username, email, secondname, description, image, wantToLearns, howToKnows, joinEvents, favVault, follow} = req.body.userInfo;
     ProfileModel.findByIdAndUpdate(req.session.loggedInUser._id, {$set: {username: username, email: email, secondname: secondname, description: description, image: image, wantToLearns: wantToLearns, howToKnows: howToKnows, joinEvents: joinEvents, favVault: favVault, follow: follow}})
           .then((response) => {
                res.status(200).json(response)
           })
           .catch((err) => {
                console.log(err)
                res.status(500).json({
                     error: 'Something went wrong',
                     message: err
                })
           }) 
 })

 
router.patch('/profile/event/join', isLoggedIn, (req, res) => {
     
     const {eventId} = req.body;
     console.log(req.body)
      ProfileModel.findByIdAndUpdate(req.session.loggedInUser._id, {$push:{joinEvents:eventId }} )
            .then((response) => {
               ProfileModel.findById(req.session.loggedInUser._id)
                    .then((user) => {
                         req.session.loggedInUser = user
                         res.status(200).json(response)
                    })
               
            })
            .catch((err) => {
                 console.log(err)
                 res.status(500).json({
                      error: 'Something went wrong',
                      message: err
                 })
            }) 
 })
 router.patch('/profile/event/unjoin', isLoggedIn, (req, res) => {
      
      const {eventId} = req.body;
      ProfileModel.findByIdAndUpdate(req.session.loggedInUser._id,  {$pull:{joinEvents:eventId }} )
            .then((response) => {
               ProfileModel.findById(req.session.loggedInUser._id)
               .then((user) => {
                    req.session.loggedInUser = user
                    res.status(200).json(response)
               })
            })
            .catch((err) => {
                 console.log(err)
                 res.status(500).json({
                      error: 'Something went wrong',
                      message: err
                 })
            }) 
  })

module.exports = router;
