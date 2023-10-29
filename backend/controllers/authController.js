const User = require("../models/user");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "1d" });
};
const loginUser = async (req, res) => {
  const { username, email, password, role, createdEvents, rsvpdEvents } =
    req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.status(200).json({ email, role: user.role, username: user.username, token, _id: user._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const signupUser = async (req, res) => {
  const { username, email, password, role, createdEvents, rsvpdEvents } = req.body;
  try{
    
    const user = await User.signup(username, email, password, role);
    const token = createToken(user._id);
    res
      .status(200)
      .json({
        email,
        role: user.role,
        username: user.username,
        token,
        _id: user._id,
      });
  }catch(error){
 res.status(400).json({ error: error.message});
  }
};

const getUserRole = async (req, res) => {
  const { email } = req.query;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { role } = user;
    res.status(200).json({ role });
  } catch (error) {
    console.error("Error fetching user role:", error);
    res.status(500).json({ message: "Error fetching user role", error: error.message });
  }
};


module.exports = { loginUser, signupUser, getUserRole };
