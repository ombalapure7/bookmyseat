const Theater = require("../models/Theater");
const User = require("../models/User");

const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

/**
 * @desc Configure mail
 */
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SEND_GRID_TOKEN,
    },
  })
);

/**
 * @desc  Get theaters
 * @param {*} req
 * @param {*} res
 */
const getTheaters = async (req, res) => {
  const theaters = await Theater.find({
    userId: req.user.userId,
  });
  res.status(200).json({ theaters, length: theaters.length });
};

/**
 * @desc  Create a theater
 * @param {*} req
 * @param {*} res
 */
const createTheater = async (req, res) => {
  const theater = await Theater.create({
    ...req.body,
    userId: req.user.userId,
  });
  res.status(200).json({ theater, msg: "Theater created" });
};

/**
 * @desc Book a show
 * @param {*} req
 * @param {*} res
 */
const bookShow = async (req, res) => {
  req.body.userId = req.user.userId;

  await Theater.findOneAndUpdate(
    { _id: req.body.theaterId },
    { $addToSet: { bookings: req.body } },
    { safe: true, upsert: true, new: true },
    function (err) {
      if (err) {
        console.log("Error while adding item to the cart: ", err);
      } else {
        console.log("Bookings updated!");
      }
    }
  );

  const user = await User.findOne({ _id: req.user.userId });
  transporter.sendMail({
    to: user.email,
    from: "ombalapure@outlook.com",
    subject: "BookMySeat booking confirmation",
    html: `<h4>Hi ${user.name}!</h4>
      <p>Your booking for the ${req.body.name} has been confirmed.</p>
      <p><b>Show timing</b>: ${req.body.from} to ${req.body.to}</p>
      <p><b>Date</b>: ${req.body.date}</p>
      <p><b>Seats</b>: ${req.body.seats}</p>
      <p><b>Thanks,</b></p>
      <p><b><i>BookMySeat ©</i></b></p>
    `,
  });

  res.status(200).json({ booking: req.body });
};

module.exports = { getTheaters, bookShow, createTheater };
