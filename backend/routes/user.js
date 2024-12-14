const express = require('express');

const {
    createUser,loginUser,
     updatePassword,
    updateProfile,
    manageCity,
    getUserProfile
} = require('../controller/userController')
const validateToken = require('../middleware/validateToken');
const router = express.Router();

router.post('/signin', loginUser)
router.post('/signup', createUser); 
router.put('/password', validateToken,updatePassword)
router.put('/profile',validateToken,updateProfile)
router.put('/address/city', validateToken,manageCity)
router.get('/getprofile', validateToken, getUserProfile)


module.exports = router;