const express = require('express')
const router = express.Router()
const { isLoggedIn } = require('../helpers/auth-helper'); // to check if user is loggedIn
const EventModel = require('../models/event.model');
const ProfileModel = require('../models/profile.model');


router.get("/events", isLoggedIn, (req, res, next) => {
  EventModel.find()
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


router.post("/addEvent", isLoggedIn, (req, res, next) => {
const{ title,description,date,imageUrl,keywords } = req.body.eventDetails;
console.log(req.body)
  EventModel.create({title,description,date,imageUrl,keywords, created_by: req.session.loggedInUser._id})
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

router.delete("/event/:eventId/delete", isLoggedIn, (req,res)=>{
const {eventId} = req.params;
console.log(eventId)
EventModel.findByIdAndDelete(eventId)
     .then((response)=>{
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
  

module.exports = router
