
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User.js');
//const { createTokenForUser, validateToken } = require('../service/authentication');

const allowedEmailDomains= ['ei.nits.ac.in','ece.nits.ac.in'];

const JWT = require("jsonwebtoken");

const secret = "abhinab"

function createTokenForUser(user) {
    const payLoad ={
        _id: user._id,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role: user.role

    }
    const token = JWT.sign(payLoad, secret);
    return token;
}





const isEmailAllowed = (email) => {
    const domain = email.split('@')[1];
    return allowedEmailDomains.includes(domain);
  };
router.post('/signup', async (req, res) => {
  const { FullName, email, password } = req.body;

  try {
    if (!isEmailAllowed(email)) {
        return res.status(400).json({ msg: 'Email domain not allowed' });
      }
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

   
    user = new User({ FullName, email, password });


    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);


    await user.save();

   res.redirect('/');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {

    let user = await User.findOne({ email });
   
    if (!user) {
      return res.render('signin',{
        error:'User not found'
      });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('signin',{
        error:'Password or email no matched'
      });
    }
    const token = createTokenForUser(user);
    console.log(token);

    return res.cookie("token", token,{httpOnly:true}).redirect('/');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
router.post('/logout', (req, res) => {
  res.clearCookie('token').redirect('/');
});





router.get('/signin', (req, res) => {
    return res.render('signin');
})
router.get('/signup', (req, res) => {
    return res.render('signup');
}
)
module.exports = router;