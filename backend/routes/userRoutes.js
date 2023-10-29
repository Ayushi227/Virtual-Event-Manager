const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Define user-related routes
router.get("/:userId", userController.getUserProfile);
// router.get("/:userId/events/hosted", userController.getHostedEvents);
router.get("/:userId/events/rsvp", userController.getRSVPdEvents);

module.exports = router;
