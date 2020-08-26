const express = require('express')
const router = express.Router()
let ProfileModel = require('../models/profile.model')
let EventModel = require('')
const { isLoggedIn } = require('../helpers/auth-helper');// to check if user is loggedIn

//------------USER ROUTES---------
router.get('/api/user/:id', (req, res) =>{
  ProfileModel.find()
    .then((user) => {
      res.status(200).json(user)
    })
    .catch((err)=>{
      res.status(500).json({
        error: 'Something went wrong',
        message: err
    })
  })         
})

router.patch('/api/user/:id/edit', (req, res) => {
  let id = req.params.id
  //WHAT DO WE WANT TO CHANGE
  const {username, secondname, mail, description, image} = req.body;
  ProfileModel.findByIdAndUpdate(id, {$set: {username: username, secondname: secondname, mail: mail, description: description, image: image}})
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

router.post('/api/user/:id/events/add', (req, res)=>{

})