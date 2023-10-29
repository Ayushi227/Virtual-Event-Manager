const mongoose = require("mongoose");
const bcrypt= require("bcrypt")
const validator= require("validator")


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: false,
    unique: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  createdEvents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
  ],
  rsvpdEvents: [
    {
       type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
       }
  ],
});

// static signup method

userSchema.statics.signup = async function (username, email, password, role) {
  //validation
  if (!email || !password) {
    throw Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Invalid Email");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Not Strong Password");
  }

  const exists = await this.findOne({ email });
  if (exists) {
    throw Error("Email already in use");
  }
  const Usernameexists = await this.findOne({ username });
   if (Usernameexists) {
     throw Error("Username already in use");
   }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    username:username,
    email:email,
    role: role,
    password: hash,
  });
  return user;
};


userSchema.statics.login=async function(email, password){
  if (!email || !password) {
    throw Error("All fields must be filled");
  }
    const user = await this.findOne({ email });
    if(!user){
       throw Error("Incorrect Email");
    }
    const match= await bcrypt.compare(password, user.password)

    if(!match) throw Error('Invalid password')

    return user
}

module.exports = mongoose.model("User", userSchema);
