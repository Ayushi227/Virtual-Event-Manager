const express = require("express");

const {
  getAllEvents,
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
  rsvpToEvent } = require("../controllers/eventController");
const requireAuth =require ('../middleware/requireAuth')
const router = express.Router();

router.use(requireAuth)
// Define event-related routes
router.get("/dashboard", getAllEvents);
router.get("/:eventId", getEventById);
router.post("/", createEvent); 
router.put("/:eventId", updateEvent);
router.delete("/:eventId", deleteEvent);
router.post("/:eventId/rsvp", rsvpToEvent);

module.exports = router;
