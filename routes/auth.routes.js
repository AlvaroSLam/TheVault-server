const {isLoggedIn} = require('../helpers/auth-helper');
const router = require('.');
const bcrypt = require('bcryptjs');
const ProfileModel = require ('../models/profile.model')
const { isLoggedIn } = require('../helpers/auth-helper'); // to check if user is loggedIn

//---------------------SIGNUP--------------------//
//----------------------------------------------//
router.post('/signup', (req, res) => {
  //requiere username, email and pasword on the client side
  const {username, email, password } = req.body;
  console.log(username, email, password);
  //Error 1. Enter all details
  if (!username || !email || !password) {
      res.status(500)
        .json({
          errorMessage: 'Please enter username, email and password'
        });
      return;  
  }

  //Error 2. Enter an email format correct
  const myRegex = new RegExp(/^[a-z0-9](?!.*?[^\na-z0-9]{2})[^\s@]+@[^\s@]+\.[^\s@]+[a-z0-9]$/);
  if (!myRegex.test(email)) {
      res.status(500)
        .json({
          errorMessage: 'Email format not correct'
      });
      return;  
  }
  //Error 3. PASSWORD. 8 characters, number, Uppercase and symbol like@
  const myPassRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/);
  if (!myPassRegex.test(password)) {
    res.status(500)
        .json({
          errorMessage: 'Password needs to have 8 characters, a symbol, a number and an Uppercase alphabet'
        });
      return;  
  }

  //Salting the password
  bcrypt.genSalt(12)
    .then((salt) => {
      console.log('Salt: ', salt);
      bcrypt.hash(password, salt)
        .then((passwordHash) => {
          ProfileModel.create({email, username, passwordHash})
            .then((user) => {
              user.passwordHash = "***";
              req.session.loggedInUser = user;
              console.log(req.session)
              res.status(200).json(user);
            })
            .catch((err) => {
              if (err.code === 11000) {
                res.status(500)
                .json({
                  errorMessage: 'username or email entered already exists!'
                });
                return;  
              } 
              else {
                res.status(500)
                .json({
                  errorMessage: 'Something went wrong! Go to sleep!'
                });
                return; 
              }
            })
        });  
});

});


//---------------------SIGNIN--------------------//
//----------------------------------------------//

router.post('/signin', (req, res) => {
  //We required the email and the password from the client side
  const {email, password } = req.body;

  //Error 1. Check if email and password is not present
  if ( !email || !password) {
      res.status(500).json({
          error: 'Please enter email and password',
     })
    return;  
  }

  //Error 2. Check if the mail is not written in a correct format
  const myRegex = new RegExp(/^[a-z0-9](?!.*?[^\na-z0-9]{2})[^\s@]+@[^\s@]+\.[^\s@]+[a-z0-9]$/);
  if (!myRegex.test(email)) {
      res.status(500).json({
          error: 'Email format not correct',
      })
      return;  
  }

  // Find if the user exists in the database 
  ProfileModel.findOne({email})
    .then((userData) => {
         //check if passwords match
        bcrypt.compare(password, userData.passwordHash)
          .then((doesItMatch) => {
              //if it matches
              if (doesItMatch) {
                // req.session is the special object that is available to you
                userData.passwordHash = "***";
                req.session.loggedInUser = userData;
                console.log('Signin', req.session)
                res.status(200).json(userData)
              }
              //if passwords do not match
              else {
                  res.status(500).json({
                      error: 'Passwords don\'t match',
                  })
                return; 
              }
          })
          .catch(() => {
              res.status(500).json({
                  error: 'Email format not correct',
              })
            return; 
          });
    })
    //throw an error if the user does not exists 
    .catch((err) => {
      res.status(500).json({
          error: 'Email format not correct',
          message: err
      })
      return;  
    });

});


//---------------------LOGOUT--------------------//
//----------------------------------------------//
router.post('/logout', (req, res) => {
  req.session.destroy();
  res
  .status(204) //  No Content
  .send();
})


router.get("/user", isLoggedIn, (req, res, next) => {
  res.status(200).json(req.session.loggedInUser);
});

  module.exports = router;