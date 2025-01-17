const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Doctor = mongoose.model("Doctor");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

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
