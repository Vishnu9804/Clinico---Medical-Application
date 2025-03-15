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

router.post("/resetpass", (req, res) => {
  const { doc_email, password } = req.body;
  if (!doc_email || !password) {
    return res.status(422).json({ error: "Please Enter Required Fields!!!!" });
  } else {
    Doctor.findOne({ doc_email: doc_email }).then(async (savedUser) => {
      if (savedUser) {
        savedUser.password = password;
        savedUser
          .save()
          .then((user) => {
            res.json({ message: "Password Updated Succefully!!!!" });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        res.status(422).json({ error: "Invalid Credential" });
      }
    });
  }
});

router.post("/doctordata", (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res
      .status(422)
      .json({ error: "You Must be Logged In Token not given!!!!" });
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(422).json({ error: "Token Invalid!!!!" });
    }
    const { _id } = payload;
    Doctor.findById(_id).then((userdata) => {
      res.status(200).send({
        message: "User data fetched succefully!!!!",
        user: userdata,
      });
    });
  });
});

router.post("/doctorprofiledata", (req, res) => {
  const { doc_email } = req.body;
  console.log("Into route", doc_email);
  if (!doc_email) {
    return res
      .status(422)
      .json({ error: "You Must be Logged In Token not given!!!!" });
  }
  Doctor.findOne({ doc_email: doc_email }).then((userdata) => {
    res.status(200).send({
      message: "User data fetched succefully!!!!",
      user: userdata,
    });
  });
});

router.post("/updateprofile", async (req, res) => {
  const {
    doc_email, // Required to identify the doctor
    doc_name,
    doc_phone,
    doc_dob,
    doc_spec,
    doc_gender,
    doc_degree,
    doc_exp,
    clinic_time,
    clinic_name,
    clinic_phone,
    clinic_add,
  } = req.body;

  if (!doc_email) {
    return res
      .status(422)
      .json({ error: "Email is required to update profile" });
  }

  try {
    const updateFields = {};
    if (doc_name) updateFields.doc_name = doc_name;
    if (doc_phone) updateFields.doc_phone = doc_phone;
    if (doc_dob) updateFields.doc_dob = doc_dob;
    if (doc_gender) updateFields.doc_gender = doc_gender;
    if (doc_spec) updateFields.doc_spec = doc_spec;
    if (doc_degree) updateFields.doc_degree = doc_degree;
    if (doc_exp) updateFields.doc_exp = doc_exp;
    if (clinic_time) updateFields.clinic_time = clinic_time;
    if (clinic_name) updateFields.clinic_name = clinic_name;
    if (clinic_phone) updateFields.clinic_phone = clinic_phone;
    if (clinic_add) updateFields.clinic_add = clinic_add;

    const updatedDoctor = await Doctor.findOneAndUpdate(
      { doc_email },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    console.log("Profile updated successfully");
    return res
      .status(200)
      .json({ message: "Profile updated successfully", updatedDoctor });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Failed to update profile" });
  }
});
router.post("/setprofilepic", (req, res) => {
  const { email, profilepic } = req.body;
  Doctor.findOne({ email: email })
    .then((savedUser) => {
      if (!savedUser) {
        return res.status(422).json({ error: "Invalid Credentials" });
      }
      savedUser.profilepic = profilepic;
      savedUser
        .save()
        .then((user) => {
          res.json({ message: "Profile picture updated successfully" });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});
router.post("/addreminder", async (req, res) => {
  console.log("Called this");
  const { doc_email, date, reminder } = req.body;

  if (!doc_email || !date || !reminder) {
    return res
      .status(422)
      .json({ error: "Email, date, and reminder are required" });
  }

  try {
    // Find the doctor by email
    const doctor = await Doctor.findOne({ doc_email });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Check if a reminder entry for the given date already exists
    const existingReminder = doctor.doc_rem.find((rem) => rem.date === date);

    if (existingReminder) {
      // If the date already exists, add the new reminder to the existing reminders
      existingReminder.reminders.push(reminder);
    } else {
      // If no existing reminder for this date, create a new entry
      doctor.doc_rem.push({
        date: date, // Store the date as a string
        reminders: [reminder],
      });
    }

    // Save the updated doctor profile
    await doctor.save();

    console.log("Reminder added successfully");
    return res.status(200).json({
      message: "Reminder added successfully",
      doc_rem: doctor.doc_rem,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Failed to add reminder" });
  }
});

router.post("/showreminder", async (req, res) => {
  const { doc_email, date } = req.body;

  console.log("Getting from user :- " + doc_email);
  console.log("Getting from user :- " + date);

  if (!doc_email || !date) {
    return res.status(422).json({ error: "Email and date are required" });
  }

  try {
    // Find the doctor by email
    const doctor = await Doctor.findOne({ doc_email });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Find the specific date entry in the doc_rem array
    const reminderEntry = doctor.doc_rem.find((rem) => rem.date === date);

    if (!reminderEntry) {
      return res
        .status(404)
        .json({ error: "No reminders found for this date" });
    }

    // Return the reminders for that date
    return res.status(200).json({
      message: "Reminders retrieved successfully",
      reminders: reminderEntry.reminders, // Array of reminders for the date
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Failed to retrieve reminders" });
  }
});

router.post("/deletereminder", async (req, res) => {
  const { doc_email, date, index } = req.body;

  if (!doc_email || !date || index === undefined) {
    return res
      .status(422)
      .json({ error: "Email, date, and index are required" });
  }

  try {
    // Find the doctor by email
    const doctor = await Doctor.findOne({ doc_email });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Find the specific date in the doc_rem array
    const reminderEntry = doctor.doc_rem.find((rem) => rem.date === date);

    if (!reminderEntry) {
      return res
        .status(404)
        .json({ error: "No reminders found for this date" });
    }

    // Check if the index is valid
    if (index < 0 || index >= reminderEntry.reminders.length) {
      return res.status(400).json({ error: "Invalid reminder index" });
    }

    // Remove the reminder at the given index
    reminderEntry.reminders.splice(index, 1);

    // If no reminders left for that date, optionally remove the whole entry
    if (reminderEntry.reminders.length === 0) {
      const entryIndex = doctor.doc_rem.indexOf(reminderEntry);
      doctor.doc_rem.splice(entryIndex, 1); // Remove the whole entry
    }

    // Save the updated doctor profile
    await doctor.save();

    console.log("Reminder deleted successfully");

    return res.status(200).json({
      message: "Reminder deleted successfully",
      doc_rem: doctor.doc_rem, // Return the updated doc_rem array
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Failed to delete reminder" });
  }
});
router.post("/addstaff", async (req, res) => {
  const { doc_email, staff_email, designation } = req.body;

  if (!doc_email || !staff_email || !designation) {
    return res.json({
      error: "docter email or staff email or designation missing",
    });
  }

  try {
    const doctor = await Doctor.findOne({ doc_email });

    if (!doctor) {
      return res.json({ error: "Doctor not found" });
    }

    doctor.emp_list.push({ staff_email, designation });
    await doctor.save();

    return res.json({ message: "Staff Added Succefully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Failed to Add Staff" });
  }
});

router.post("/showstaff", async (req, res) => {
  const { doc_email } = req.body;

  console.log("Getting from user :- " + doc_email);

  if (!doc_email) {
    return res.status(422).json({ error: "Doctor email is required" });
  }

  try {
    // Find the doctor by email
    const doctor = await Doctor.findOne({ doc_email });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Check if the doctor has any staff members
    if (!doctor.emp_list || doctor.emp_list.length === 0) {
      return res.status(200).json({
        message: "No staff members found",
        staff: [],
      });
    }

    console.log(doctor.emp_list);
    // Return the list of staff members
    return res.status(200).json({
      message: "Staff members retrieved successfully",
      staff: doctor.emp_list,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to retrieve staff members" });
  }
});

router.post("/showstaffcategories", async (req, res) => {
  const { doc_email } = req.body;

  console.log("Getting from user :- " + doc_email);

  if (!doc_email) {
    return res.status(422).json({ error: "Doctor email is required" });
  }

  try {
    // Find the doctor by email
    const doctor = await Doctor.findOne({ doc_email });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Return the list of staff categories
    return res.status(200).json({
      message: "Staff categories retrieved successfully",
      categories: doctor.emp_category,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Failed to retrieve staff categories" });
  }
});
