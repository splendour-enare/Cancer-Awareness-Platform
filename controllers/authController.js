// controllers/authController.js
const User = require("../models/User");
const Resource = require("../models/Resource");
const path = require("path");
const multer = require("multer");

// ---------------- PUBLIC PAGES ----------------
exports.homePage = (req, res) => {
  res.render("index");
};

// GET register page
exports.getRegister = (req, res) => {
  res.render("register");
};

// POST register form
exports.postRegister = async (req, res) => {
  try {
    const { name, email, password, confirm_password } = req.body;

    // Basic validation
    if (password !== confirm_password) {
      return res.send("Passwords do not match");
    }

    // Save user (MongoDB)
    const user = new User({
      name,
      email,
      password
    });

    await user.save();

    // Redirect after success
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    res.send("Error creating account");
  }
};

// GET login page
exports.getLogin = (req, res) => {
  res.render("login");
};

// POST login (placeholder)
// POST login
exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user in the database
    const user = await User.findOne({ email, password }); // NOTE: Use hashed passwords in production

    if (!user) {
      return res.send("Invalid email or password");
    }

    // Save user ID in session
    req.session.userId = user._id;

    // Check if the user is admin
    if (user.email === "admin@gmail.com" && user.password === "admin") {
      // Redirect admin to dashboard
      return res.redirect("/admin-dashboard");
    }

    // Otherwise, redirect regular users
    res.redirect("/select-questions");

  } catch (err) {
    console.error(err);
    res.send("Login failed. Please try again.");
  }
};

exports.selectQuestionsPage = (req, res) => {
  res.render("select-questions");
};

exports.breastAssessmentPage = (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.redirect("/login"); // force login

  res.render("breast-assessment", { userId });
};

exports.prostateAssessmentPage = (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.redirect("/login");

  res.render("prostate-assessment", { userId });
};


exports.breastResourcesPage = (req, res) => {
  res.render("breast-resources");
};

exports.prostateResourcesPage = (req, res) => {
  res.render("prostate-resources");
};

// ---------------- ADMIN DASHBOARD ----------------
exports.adminDashboard = async (req, res) => {
  try {
    // Total users
    const totalUsers = await User.countDocuments();

    // Users who have taken at least one assessment
    const assessmentsTaken = await User.countDocuments({
      $or: [
        { breastCancerRisk: { $ne: null } },
        { prostateCancerRisk: { $ne: null } }
      ]
    });

    // Resource counts
    const breastResources = await Resource.countDocuments({
      cancerType: "breast"
    });

    const prostateResources = await Resource.countDocuments({
      cancerType: "prostate"
    });

    res.render("admin-dashboard", {
      title: "Admin Dashboard",
      stats: {
        users: totalUsers,
        assessments: assessmentsTaken,
        breastResources,
        prostateResources
      }
    });

  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.status(500).send("Failed to load dashboard");
  }
};

// ---------------- USERS ----------------
exports.viewUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.render("users", {
      title: "Manage Users",
      users
    });
  } catch (err) {
    console.error(err);
    res.send("Error loading users");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    await User.findByIdAndDelete(userId);

    res.redirect("/users");
  } catch (err) {
    console.error(err);
    res.send("Error deleting user");
  }
};

// ---------------- RESOURCES ----------------

exports.addResource = async (req, res) => {
  try {
    const { title, content } = req.body;
    const { category } = req.params;
    const cancerType = req.path.includes("breast")
      ? "breast"
      : "prostate";

    if (!req.file) {
      return res.status(400).send("Image is required");
    }

    const resource = new Resource({
      cancerType,
      category,
      title,
      content,
      image: `/uploads/resources/${req.file.filename}`
    });

    await resource.save();

    res.redirect("/resources");

  } catch (error) {
    console.error("Resource upload error:", error);
    res.status(500).send("Failed to add resource");
  }
};

// ---------------- ASSESSMENTS STATS ----------------
exports.assessmentPage = async (req, res) => {
  try {
    const users = await User.find({
      $or: [
        { breastCancerRisk: { $ne: null } },
        { prostateCancerRisk: { $ne: null } }
      ]
    });

    let low = 0;
    let moderate = 0;
    let high = 0;

    users.forEach(user => {
      const risk =
        user.breastCancerRisk || user.prostateCancerRisk;

      switch (risk) {
        case "Low Risk / Low Immediate Concern":
          low++;
          break;

        case "Moderate Risk":
          moderate++;
          break;

        case "High Risk":
          high++;
          break;
      }
    });

    const total = low + moderate + high;

    const percentage = (value) =>
      total === 0 ? 0 : ((value / total) * 100).toFixed(1);

    res.render("assessments", {
      title: "Assessment Overview",
      assessmentStats: {
        total,
        low,
        moderate,
        high,
        lowPercent: percentage(low),
        moderatePercent: percentage(moderate),
        highPercent: percentage(high)
      }
    });

  } catch (error) {
    console.error("Assessment stats error:", error);
    res.status(500).send("Failed to load assessment statistics");
  }
};

exports.breastPreventionResources = async (req, res) => {
  try {
    const resources = await Resource.find({
      cancerType: 'breast',
      category: 'prevention'
    }).sort({ createdAt: -1 });

    res.render('breast-prevention-resources', { 
      title: 'Breast Cancer Prevention Tips',
      resources
    });
  } catch (err) {
    console.error(err);
    res.send('Error loading resources');
  }
};

exports.prostatePreventionResources = async (req, res) => {
  try {
    const resources = await Resource.find({
      cancerType: 'prostate',
      category: 'prevention'
    }).sort({ createdAt: -1 });

    res.render('prostate-prevention-resources', {
      title: 'Prostate Cancer Prevention Tips',
      resources
    });
  } catch (error) {
    console.error(error);
    res.send('Unable to load prostate cancer prevention resources');
  }
};

exports.breastRiskResources = async (req, res) => {
  try {
    const resources = await Resource.find({
      cancerType: 'breast',
      category: 'risks'
    }).sort({ createdAt: -1 });

    res.render('breast-risk-resources', {
      title: 'Understanding Breast Cancer Risks',
      resources
    });
  } catch (error) {
    console.error(error);
    res.send('Unable to load breast cancer risk resources');
  }
};

exports.prostateRiskResources = async (req, res) => {
  try {
    const resources = await Resource.find({
      cancerType: 'prostate',
      category: 'risks'
    }).sort({ createdAt: -1 });

    res.render('prostate-risk-resources', {
      title: 'Understanding Prostate Cancer Risks',
      resources
    });
  } catch (error) {
    console.error(error);
    res.send('Unable to load prostate cancer risk resources');
  }
};