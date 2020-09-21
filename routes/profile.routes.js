const express = require('express')
const router = express.Router()
const { isLoggedIn } = require('../helpers/auth-helper'); // to check if user is loggedIn
const ProfileModel = require('../models/profile.model');
const EventModel = require('../models/event.model');
const VaultModel = require('../models/vault.model');

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

     if (!image || !username || !email) {
          res.status(500)
            .json({
              errorMessage: 'Please add a username, email and profile image'
            });
          return;  
      }

      const myRegex = new RegExp(/^[a-z0-9](?!.*?[^\na-z0-9]{2})[^\s@]+@[^\s@]+\.[^\s@]+[a-z0-9]$/);
      if (!myRegex.test(email)) {
          res.status(500)
            .json({
              errorMessage: 'Email format not correct'
          });
          return;  
      }

     ProfileModel.findByIdAndUpdate(req.session.loggedInUser._id, {$set: {username: username, email: email, secondname: secondname, description: description, image: image, wantToLearns: wantToLearns, howToKnows: howToKnows, joinEvents: joinEvents, favVault: favVault, follow: follow}})
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

 router.delete("/profile/:userId/delete", isLoggedIn, (req,res)=>{
     const {userId} = req.params;
     EventModel.deleteMany({created_by:userId})
          .then(()=>{   
               VaultModel.deleteMany({created_by:userId})
               .then(()=>{
                    ProfileModel.findByIdAndDelete(userId)
                         .then((response)=>{
                              ProfileModel.findById(req.session.loggedInUser._id)
                                   .then((user) => {
                                        req.session.loggedInUser = user
                                        res.status(200).json(response)
                                        req.session.destroy();
                                   })
                         
                                   .catch((err) => {
                                        console.log(err)
                                        res.status(500).json({
                                             error: 'Something went wrong',
                                             message: err
                                        })
                                   }) 
                         })

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

router.get('/allusers', isLoggedIn,(req,res)=>{
     ProfileModel.find()
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

router.patch('/profile/follow/unfollow', isLoggedIn, (req, res) => { 
     const {userId} = req.body;
     ProfileModel.findByIdAndUpdate(req.session.loggedInUser._id,  {$pull:{follow:userId }} )
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

 router.patch('/profile/follow/follow', isLoggedIn, (req, res) => { 
     const {userId} = req.body;
     console.log(req.body)
      ProfileModel.findByIdAndUpdate(req.session.loggedInUser._id, {$push:{follow:userId }} )
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
