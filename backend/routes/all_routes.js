const express = require('express');
const router = express.Router();
const { addUser, deleteUser, updateUser,loginUser } = require('../controllers/userController');
const propertyOfferController = require('../controllers/propertyController');
const offerController = require('../controllers/offerController');
const appointmentController = require('../controllers/appointmentController');
const messageController = require('../controllers/messageController');
const ratingController = require('../controllers/ratingController');

// Routes
router.post('/users/add', addUser);
// router.delete('/users/delete', deleteUser);
// router.put('/users/update', updateUser);
router.post('/users/login', loginUser);

router.post('/properties/add', propertyOfferController.addPropertyWithOffer);
router.delete('/properties/delete', propertyOfferController.deletePropertyWithOffer);
// router.put('/properties/update', propertyOfferController.updatePropertyWithOffer);
router.get('/properties/search', propertyOfferController.searchProperties);
router.get('/properties/person', propertyOfferController.getAllProperties);
router.post('/properties/get_type' ,propertyOfferController.getPropertyCountByType)
router.get('/properties/get_all/:user_id',propertyOfferController.getAllProperties);
router.get('/properties/get_all_without_id',propertyOfferController.get_All_Properties);
router.post('/offers/add', offerController.addOffer);
router.post('/offers/get', offerController.getAllOffers);
router.delete('/offers/delete', offerController.deleteOffer);
router.put('/offers/update', offerController.updateOfferStatus);

router.post('/appointments/add', appointmentController.addAppointment);
router.post('/appointments/get', appointmentController.getAllAppointments);

router.post('/messages/add', messageController.addMessage);
router.post('/messages/property', messageController.getMessages);

router.post('/ratings/add', ratingController.addRating);
router.post('/ratings/get', ratingController.fetchRatings);
router.put('/ratings/update', ratingController.updateRating);

module.exports = router;
