const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user");
const Event = require("./models/event");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const userRoutes = require("./routes/userRoutes");
const app = express();

app.use(express.json());
app.use((req, res, next) => {
  console.log(console.log(req.path, req.method));
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/userRoutes", userRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.get("/home", (req, res)=>{
   res.json({'user': '/user', 'admin': '/admin'})
});


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => console.log("Listening on port 4000"));
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

 


