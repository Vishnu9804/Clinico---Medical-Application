const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Patient = mongoose.model("Patient");
const Doctor = mongoose.model("Doctor");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");

async function mailer(reciveremail, code) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,

    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.NodeMailer_email,
      pass: process.env.NodeMailer_password,
    },
  });

  let info = await transporter.sendMail({
    from: "Clinico",
    to: `${reciveremail}`,
    subject: "Email Verification",
    text: `Your Verification Code is ${code}`,
    html: `<b>Your Verification Code is ${code}</b>`,
  });
  console.log("Message Sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

router.post("/psignup", async (req, res) => {
  const { pat_email, pat_pass, pat_phone, pat_gender, pat_add } = req.body;

  if (!pat_email || !pat_pass || !pat_phone || !pat_gender || !pat_add) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  const patient = new Patient({
    pat_email,
    pat_pass,
    pat_phone,
    pat_gender,
    pat_add,
  });

  try {
    await patient.save();
    console.log("Done....");
    return res.status(201).json({ message: "User Registered Successfully" });
  } catch (err) {
    console.log(err);
    return res.status(422).json({ error: "User Not Registered" });
  }
});

router.post("/psignin", (req, res) => {
  const { pat_email, pat_pass } = req.body;

  if (!pat_email || !pat_pass) {
    return res.status(422).json({ error: "Please add all the fields" });
  } else {
    Patient.findOne({ pat_email: pat_email })
      .then((savedUser) => {
        if (!savedUser) {
          return res.status(422).json({ error: "Invalid Credentials" });
        } else {
          console.log(savedUser);
          bcrypt.compare(pat_pass, savedUser.pat_pass).then((doMatch) => {
            if (doMatch) {
              const token = jwt.sign(
                { _id: savedUser._id },
                process.env.JWT_SECRET
              );

              const { _id, pat_email } = savedUser;

              res.json({
                message: "Successfully Signed In",
                name: savedUser.pat_email,
                token,
                user: { _id, pat_email },
              });
            } else {
              return res.status(422).json({ error: "Invalid Credentials" });
            }
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
});
router.post("/patientdata", (req, res) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res
      .status(422)
      .json({ error: "You Must be Logged In. Token not given!!!!" });
  }

  const token = authorization.replace("Bearer ", "");

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(422).json({ error: "Token Invalid!!!!" });
    }

    const { _id } = payload;

    Patient.findById(_id)
      .then((userdata) => {
        if (!userdata) {
          return res.status(404).json({ error: "Patient not found!" });
        }

        res.status(200).send({
          message: "User data fetched successfully!!!!",
          user: userdata,
        });
      })
      .catch((err) => {
        console.error("Error fetching patient data:", err);
        res.status(500).json({ error: "Internal Server Error" });
      });
  });
});

router.post("/pverify", (req, res) => {
  console.log("sent by client", req.body);
  const { pat_email } = req.body;

  if (!pat_email) {
    return res.status(422).json({ error: "Please add all fields" });
  }
  Patient.findOne({ pat_email: pat_email }).then(async (savedUser) => {
    if (savedUser) {
      return res.status(422).json({ error: "Invalid Email" });
    }
    try {
      let verificationCode = Math.floor(100000 + Math.random() * 900000);
      await mailer(pat_email, verificationCode);
      console.log("Verification Code", verificationCode);
      res.send({
        message: "Verification code sent to your Email",
        verificationCode,
        pat_email,
      });
    } catch (err) {
      console.log(err);
    }
  });
});