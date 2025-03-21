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

router.post("/addstaffcategory", async (req, res) => {
  const { doc_email, category } = req.body;

  if (!doc_email || !category) {
    return res
      .status(422)
      .json({ error: "Doctor email and category are required" });
  }

  try {
    const doctor = await Doctor.findOne({ doc_email });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Check if the category already exists
    if (doctor.emp_category.includes(category)) {
      return res.status(400).json({ error: "Category already exists" });
    }

    // Add the new category
    doctor.emp_category.push(category);
    await doctor.save();

    return res.status(200).json({
      message: "Category added successfully",
      emp_category: doctor.emp_category,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to add category" });
  }
});

// Edit staff category
router.post("/editstaffcategory", async (req, res) => {
  const { doc_email, oldCategory, newCategory } = req.body;

  if (!doc_email || !oldCategory || !newCategory) {
    return res.status(422).json({
      error: "Doctor email, old category, and new category are required",
    });
  }

  try {
    const doctor = await Doctor.findOne({ doc_email });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Check if the old category exists
    const categoryIndex = doctor.emp_category.indexOf(oldCategory);
    if (categoryIndex === -1) {
      return res.status(404).json({ error: "Old category not found" });
    }

    // Update the category
    doctor.emp_category[categoryIndex] = newCategory;
    await doctor.save();

    return res.status(200).json({
      message: "Category updated successfully",
      emp_category: doctor.emp_category,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to edit category" });
  }
});

// Remove staff category
router.post("/removestaffcategory", async (req, res) => {
  const { doc_email, category } = req.body;

  if (!doc_email || !category) {
    return res
      .status(422)
      .json({ error: "Doctor email and category are required" });
  }

  try {
    const doctor = await Doctor.findOne({ doc_email });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Check if the category exists
    const categoryIndex = doctor.emp_category.indexOf(category);
    if (categoryIndex === -1) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Remove the category
    doctor.emp_category.splice(categoryIndex, 1);

    // Ensure "Admin" is always present
    if (!doctor.emp_category.includes("Admin")) {
      doctor.emp_category.unshift("Admin");
    }

    await doctor.save();

    return res.status(200).json({
      message: "Category removed successfully",
      emp_category: doctor.emp_category,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to remove category" });
  }
});
router.post("/request-permission", async (req, res) => {
  try {
    const { doc_email, pat_email } = req.body;

    const doctor = await Doctor.findOne({ doc_email: doc_email });
    const patient = await Patient.findOne({ pat_email: pat_email });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Check if already granted
    if (
      doctor.dpermission_granted.includes(pat_email) ||
      patient.ppermission_granted.includes(doc_email)
    ) {
      return res.status(400).json({ message: "Permission already granted" });
    }
    if (
      doctor.dpermission_pending.includes(pat_email) ||
      patient.ppermission_pending.includes(doc_email)
    ) {
      return res.status(400).json({ message: "Permission already Sent" });
    }

    // If not already pending, add to pending list
    if (
      !doctor.dpermission_pending.includes(pat_email) &&
      !patient.ppermission_pending.includes(doc_email)
    ) {
      doctor.dpermission_pending.push(pat_email);
      patient.ppermission_pending.push(doc_email);
      await doctor.save();
      await patient.save();
    }

    return res.status(200).json({ message: "Permission request sent" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
router.post("/get-doctor-permission-lists", async (req, res) => {
  try {
    const { doc_email } = req.body;

    console.log(doc_email);
    const doctor = await Doctor.findOne({ doc_email: doc_email });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    return res.status(200).json({
      permission_granted: doctor.dpermission_granted,
      permission_pending: doctor.dpermission_pending,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
router.post("/getpatients", async (req, res) => {
  try {
    const { pat_emails } = req.body;

    console.log("Received emails:", pat_emails);

    if (!Array.isArray(pat_emails) || pat_emails.length === 0) {
      return res
        .status(400)
        .json({ error: "Invalid input. Provide an array of emails." });
    }

    const patients = await Patient.find(
      { pat_email: { $in: pat_emails } },
      { pat_email: 1, pat_name: 1, pat_age: 1, _id: 0 }
    );

    console.log("Patients found:", patients);

    const result = patients.map((pat) => ({
      pat_email: pat.pat_email,
      name: pat.pat_name,
    }));

    res.json(result);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post("/request-report", async (req, res) => {
  console.log("in here....");
  try {
    const { pat_email, doc_email, requested_reports } = req.body;

    // Ensure patient exists (case-insensitive search)
    const patient = await Patient.findOne({
      pat_email: { $regex: new RegExp("^" + pat_email + "$", "i") },
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Ensure doctor exists (case-insensitive search)
    const doctor = await Doctor.findOne({
      doc_email: { $regex: new RegExp("^" + doc_email + "$", "i") },
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Check if doc_email is in dpermission_granted array of the doctor
    if (!doctor.dpermission_granted.includes(pat_email)) {
      return res.status(403).json({
        message:
          "Doctor does not have permission to request reports for this patient",
      });
    }

    // Find the patient reports under the doctor
    const existingReportEntry = doctor.patient_reports.find(
      (entry) => entry.pat_email.toLowerCase() === pat_email.toLowerCase()
    );

    if (existingReportEntry) {
      // Initialize reports as null first
      let updatedReports = null;
      // Then assign it the new requested reports
      updatedReports = [...new Set(requested_reports)];

      await Doctor.findOneAndUpdate(
        { doc_email: doctor.doc_email, "patient_reports.pat_email": pat_email },
        { $set: { "patient_reports.$.reports": updatedReports } },
        { new: true }
      );
    } else {
      // Initialize reports as null first, then assign the requested ones
      let newReports = null;
      newReports = [...new Set(requested_reports)];

      await Doctor.findOneAndUpdate(
        { doc_email: doctor.doc_email },
        {
          $push: {
            patient_reports: {
              pat_email: patient.pat_email,
              reports: newReports,
            },
          },
        },
        { new: true }
      );
    }

    res.status(201).json({
      message: "Report requested successfully",
      requested_reports: requested_reports,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/get-patient-reports", async (req, res) => {
  console.log("Inside get-patient-reports...");
  try {
    const { doc_email, pat_email } = req.body; // Taking input from request body

    // Find the doctor
    const doctor = await Doctor.findOne({ doc_email });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found", reports: [] });
    }

    // Find the patient's reports inside the doctor's patient_reports array
    const patientReport = doctor.patient_reports.find(
      (p) => p.pat_email === pat_email
    );

    if (!patientReport) {
      console.log("No reports found for this patient.");
      return res
        .status(404)
        .json({ message: "No reports found for this patient", reports: [] });
    }

    res.status(200).json({
      message: "Reports retrieved successfully",
      reports: patientReport.reports || [],
    });
  } catch (error) {
    console.error("Error in /get-patient-reports:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});
router.post("/secure-patient-history", async (req, res) => {
  console.log("here inside ....");
  const { pat_email, doc_email } = req.body; // Get patient and doctor emails

  // Check if patient email and doctor email are provided
  if (!pat_email || !doc_email) {
    return res.status(400).send("Patient email and doctor email are required.");
  }

  try {
    // Find the patient by email
    const patient = await Patient.findOne({ pat_email });

    // If patient doesn't exist, return error
    if (!patient) {
      return res.status(404).send("Patient not found.");
    }

    // Find the accepted reports for the given doctor email
    const acceptedReportEntry = patient.accepted_reports.find(
      (entry) => entry.doc_email === doc_email
    );

    console.log(acceptedReportEntry);
    // If no accepted reports found for this doctor, return empty array
    if (!acceptedReportEntry) {
      return res.status(200).json({
        patientEmail: pat_email,
        patientHistory: [],
      });
    }

    const acceptedReports = acceptedReportEntry.reports; // Array of accepted report names

    // Filter patient history to only include files that match accepted reports
    const filteredPatientHistory = patient.pat_history.filter((report) =>
      acceptedReports.includes(report.fileName)
    );

    // Send success response with filtered patient history
    res.status(200).json({
      patientEmail: pat_email,
      patientHistory: filteredPatientHistory,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while fetching the patient's history.");
  }
});
router.post("/add-visiting-patient", async (req, res) => {
  try {
    const { doc_email, pat_email } = req.body;

    if (!doc_email || !pat_email) {
      return res
        .status(400)
        .json({ message: "Doctor email and Patient email are required." });
    }

    // Find doctor by email
    const doctor = await Doctor.findOne({ doc_email });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    // Find patient by email
    const patient = await Patient.findOne({ pat_email });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    // Add patient to the doctor's visiting queue (FIFO order)
    doctor.visiting_patients.push(pat_email);
    await doctor.save();

    // Add doctor to patient's visited_doctors list (Stack behavior: last added comes first)
    patient.visited_doctors = patient.visited_doctors.filter(
      (doc) => doc.doc_email !== doc_email
    );

    patient.visited_doctors.unshift({ doc_email, doc_name: doctor.doc_name });

    await patient.save();

    res.status(200).json({
      message:
        "Patient added to the visiting queue and doctor added to visited doctors successfully.",
      visiting_patients: doctor.visiting_patients, // Return updated queue
      visited_doctors: patient.visited_doctors, // Return updated visited doctors list
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});
router.post("/remove-visiting-patient", async (req, res) => {
  try {
    const { doc_email, pat_email } = req.body;

    if (!doc_email || !pat_email) {
      return res
        .status(400)
        .json({ message: "Doctor email and Patient email are required." });
    }

    // Find doctor by email
    const doctor = await Doctor.findOne({ doc_email });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    // Remove patient from visiting_patients queue
    doctor.visiting_patients = doctor.visiting_patients.filter(
      (email) => email !== pat_email
    );

    await doctor.save();

    res.status(200).json({
      message: "Patient removed from the visiting queue successfully.",
      visiting_patients: doctor.visiting_patients, // Return updated queue
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});
