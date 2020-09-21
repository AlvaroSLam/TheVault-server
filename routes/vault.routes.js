const express = require('express')
const router = express.Router()
const { isLoggedIn } = require('../helpers/auth-helper'); // to check if user is loggedIn
const VaultModel = require('../models/vault.model');
const ProfileModel = require('../models/profile.model');

router.get("/allvault", isLoggedIn, (req, res, next) => {
     ProfileModel.findById(req.session.loggedInUser._id)
     .then((user)=>{
          let userfavs = user.favVault
          console.log('userfavs', userfavs)
          VaultModel.find()
          .populate('created_by')
          .then((vaultItems) => {
               console.log('Items', vaultItems)
               let newResponse = vaultItems.map((item)=>{
                    let cloneItem= JSON.parse(JSON.stringify(item))
    
                    userfavs.includes(cloneItem._id) 
                    ? cloneItem.isFavorite=true 
                    : cloneItem.isFavorite=false 
                    return cloneItem
               })
               //console.log('result', newResponse)
               res.status(200).json(newResponse)
          })
          .catch((err) => {
               console.log(err)
               res.status(500).json({
                    error: 'Something went wrong',
                    message: err
               })
          })
     })
});

router.get("/favvaults", isLoggedIn, (req, res, next) => {
     ProfileModel.findById(req.session.loggedInUser._id)
     .populate('favVault')
     .populate('created_by')
     .then((response) => {
       let newResponse = response.favVault
       res.status(200).json(newResponse)
     })
  .catch((err) => {
       console.log(err)
       res.status(500).json({
            error: 'Something went wrong',
            message: err
       })
  })
});

router.patch('/profile/vault/add', isLoggedIn, (req, res) => { 
  const {vaultItemId} = req.body;
  console.log(req.body)
   ProfileModel.findByIdAndUpdate(req.session.loggedInUser._id, {$push:{favVault:vaultItemId }} )
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

router.patch('/profile/vault/unadd', isLoggedIn, (req, res) => { 
     const {vaultItemId} = req.body;
     ProfileModel.findByIdAndUpdate(req.session.loggedInUser._id,  {$pull:{favVault:vaultItemId }} )
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

router.post("/addVaultItem", isLoggedIn, (req, res, next) => {
     const{ title,description,fileUrl,keywords } = req.body.vaultItemDetails;
     console.log(req.body)
       VaultModel.create({title,description,fileUrl,keywords, created_by: req.session.loggedInUser._id})
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

router.delete("/vault/:vaultItemId/delete", isLoggedIn, (req,res)=>{
     const {vaultItemId} = req.params;
     console.log(vaultItemId)
     VaultModel.findByIdAndDelete(vaultItemId)
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

router.get("/vaultitemdetails/:id", isLoggedIn, (req,res)=>{
     const {id} = req.params;
     VaultModel.findById(id)
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


module.exports = router;