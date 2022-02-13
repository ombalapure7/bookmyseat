const mongoose = require("mongoose");

const TheaterSchema = new mongoose.Schema({
  owner: String,
  name: String,
  helpline: String,
  userId: String,
  city: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bookings: [
    {
      name: String,
      seats: Array,
      from: String,
      to: String,
      runTime: Number,
      theaterId: mongoose.Schema.Types.String,
      theaterName: String,
      userId: mongoose.Schema.Types.String,
    },
  ],
});

module.exports = mongoose.model("Theater", TheaterSchema);
