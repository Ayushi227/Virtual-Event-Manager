const Event = require("../models/event");
const User = require("../models/user");
const mongoose = require("mongoose");
// import { useAuthContext } from "../hooks/useAuthContext";

const getAllEvents = async (req, res) => {
  // Logic to get all events
  try {
    const events = await Event.find();
    
    res.status(200).json(events);
    // console.log(events);
  } catch (error) {
    res.status(500).json({ message: "Error getting events" });
  }
};



const createEvent = async (req, res) => {
  const { userId, title, description, date, time, location } = req.body; // Extract the necessary fields from the request body
  try {
    // Check if the user is an admin
    const user = await User.findById(userId);
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can create events" }); // Return an error response if the user is not an admin
    }
    // Logic to create the event if the user is an admin
    // Create a new event
    const newEvent = new Event({
      title,
      description,
      date,
      time,
      location,
      host: userId, // Assign the user ID as the host of the event
    });
    await newEvent.save();

    user.createdEvents.push(newEvent);
    await user.save();
    res.status(201).json({ message: "Event created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating event", error: error.message });
  }
};

// Define other event controller functions (getEventById, createEvent, updateEvent, deleteEvent, rsvpToEvent) here
// Get an event by its ID
const getEventById = async (req, res) => {
  const { eventId } = req.params;
  try {
    const event = await Event.findById(eventId);
    res.status(200).json(event);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting event by ID", error: error.message });
  }
};

// Update an event by its ID

const updateEvent = async (req, res) => {
  const { eventId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ error: "Invalid Event Id" });
  }
    const { user } = req;
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // if (user.role !== "admin") {
  //   return res.status(403).json({ message: "Only admins can update events" });
  // }
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId },
      {
        ...req.body,
      },
      { new: true }
    );

     if (!updatedEvent) {
       return res.status(400).json({ error: "No such workout" });
     }
    res.status(200).json(updatedEvent);
   
};
// Delete an event by its ID
const deleteEvent = async (req, res) => {
  const { eventId } = req.params;
  try {
    await Event.findByIdAndRemove(eventId);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting event", error: error.message });
  }
};

// RSVP to an event
const rsvpToEvent = async (req, res) => {
  const { eventId } = req.params;
  const { user } = req; // Assuming the authenticated user is available in req

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.attendees.includes(user._id)) {
      return res
        .status(400)
        .json({ message: "User already RSVP'd to the event" });
    }

    event.attendees.push(user._id);
    await event.save();

    // Update the user's rsvpdEvents
    const currentUser = await User.findOne({ _id: user._id });
    if (!currentUser.rsvpdEvents.includes(eventId)) {
      currentUser.rsvpdEvents.push(eventId);
      await currentUser.save();
    }

    res.status(200).json({ message: "RSVP to event successful" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error RSVPing to event", error: error.message });
  }
};






module.exports = {
  getAllEvents,
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
  rsvpToEvent /* Other event controller functions */,
};
