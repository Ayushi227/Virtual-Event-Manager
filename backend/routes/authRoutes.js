const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController.js");

// Define authentication routes

router.post("/login", authController.loginUser);
router.post("/signup", authController.signupUser);
router.get("/role", authController.getUserRole);

module.exports = router;
