const User = require("../models/user");
const Event = require("../models/event");

const getUserProfile = async (req, res) => {
  // Logic to get user profile
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      username: user.username,
      email: user.email,
      rsvpdEvents: user.rsvpdEvents,
    });
  } catch (error) {
    res.status(500).json({ message: "Error getting user profile" });
  }
};;


 const getRSVPdEvents = async (req, res) => {
   const { userId } = req.params;

   try {
     const user = await User.findById(userId).populate(
       "rsvpdEvents",
       "eventid"
     );
     if (!user) {
       return res.status(404).json({ message: "User not found" });
     }

     const rsvpdEvents = user.rsvpdEvents;
     res.status(200).json(rsvpdEvents);
   } catch (error) {
     res
       .status(500)
       .json({ message: "Error fetching RSVPed events", error: error.message });
   }
 };




module.exports = { getUserProfile, getRSVPdEvents };

