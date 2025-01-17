const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Doctor = mongoose.model("Doctor");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

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

router.post("/verify", (req, res) => {
  console.log("sent by client", req.body);
  const { doc_email } = req.body;

  if (!doc_email) {
    return res.status(422).json({ error: "Please add all fields" });
  }
  Doctor.findOne({ doc_email: doc_email }).then(async (savedUser) => {
    if (savedUser) {
      return res.status(422).json({ error: "Invalid Email" });
    }
    try {
      let verificationCode = Math.floor(100000 + Math.random() * 900000);
      await mailer(doc_email, verificationCode);
      console.log("Verification Code", verificationCode);
      res.send({
        message: "Verification code sent to your Email",
        verificationCode,
        doc_email,
      });
    } catch (err) {
      console.log(err);
    }
  });
});

router.post("/signup", async (req, res) => {
  const {
    password,
    doc_email,
    doc_name,
    doc_phone,
    doc_dob,
    doc_gender,
    doc_spec,
    doc_degree,
    doc_exp,
    clinic_time,
    clinic_name,
    clinic_phone,
    clinic_add,
  } = req.body;

  if (
    !password ||
    !doc_email ||
    !doc_name ||
    !doc_phone ||
    !doc_dob ||
    !doc_gender ||
    !doc_spec ||
    !doc_degree ||
    !doc_exp ||
    !clinic_time ||
    !clinic_name ||
    !clinic_phone ||
    !clinic_add
  ) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  const doctor = new Doctor({
    doc_email,
    password,
    doc_name,
    doc_phone,
    doc_dob,
    doc_gender,
    doc_spec,
    doc_degree,
    doc_exp,
    clinic_time,
    clinic_name,
    clinic_phone,
    clinic_add,
  });

  try {
    await doctor.save();
    console.log("Done....");
    return res.status(201).json({ message: "User Registered Successfully" });
  } catch (err) {
    console.log(err);
    return res.status(422).json({ error: "User Not Registered" });
  }
});

router.post("/signin", (req, res) => {
  const { doc_email, password } = req.body;

  if (!doc_email || !password) {
    return res.status(422).json({ error: "Please add all the fields" });
  } else {
    Doctor.findOne({ doc_email: doc_email })
      .then((savedUser) => {
        if (!savedUser) {
          return res.status(422).json({ error: "Invalid Credentials" });
        } else {
          console.log(savedUser);
          bcrypt.compare(password, savedUser.password).then((doMatch) => {
            if (doMatch) {
              const token = jwt.sign(
                { _id: savedUser._id },
                process.env.JWT_SECRET
              );

              const { _id, doc_email } = savedUser;

              res.json({
                message: "Successfully Signed In",
                name: savedUser.doc_name,
                token,
                user: { _id, doc_email },
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

router.post("/verifyfp", (req, res) => {
  console.log("sent by client", req.body);
  const { doc_email } = req.body;

  if (!doc_email) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  Doctor.findOne({ doc_email: doc_email }).then(async (savedUser) => {
    if (savedUser) {
      try {
        let VerificationCode = Math.floor(100000 + Math.random() * 900000);
        await mailer(doc_email, VerificationCode);
        console.log("Verification Code", VerificationCode);
        res.send({
          message: "Verification Code Sent to your Email",
          VerificationCode,
          doc_email,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      return res.status(422).json({ error: "Invalid Credentials" });
    }
  });
});
