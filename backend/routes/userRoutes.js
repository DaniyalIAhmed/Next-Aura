const express = require('express');
const { addUser, deleteUser, updateUser } = require('../controllers/userController');

const router = express.Router();

// Route to add a new user
router.post('/add', addUser);

// Route to delete a user by ID
router.delete('/delete/:id', deleteUser);

// Route to update a user by ID
router.put('/update/:id', updateUser);

module.exports = router;
