// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const upload = require("../middleware/uploadResourceImage");
const Resource = require("../models/Resource");

const { isAdmin } = require("../middleware/authMiddleware");
const User = require("../models/User");

// Public routes
router.get("/", authController.homePage);
router.get("/register", authController.getRegister);
router.post("/register", authController.postRegister);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/select-questions", authController.selectQuestionsPage);
router.get("/breast-assessment", authController.breastAssessmentPage);
router.get("/prostate-assessment", authController.prostateAssessmentPage);
router.get("/breast-resources", authController.breastResourcesPage);
router.get("/prostate-resources", authController.prostateResourcesPage);
router.get('/breast-prevention-resources', authController.breastPreventionResources);
router.get('/prostate-prevention-resources', authController.prostatePreventionResources);
router.get('/breast-risk-resources', authController.breastRiskResources);
router.get('/prostate-risk-resources', authController.prostateRiskResources);

// Save breast cancer risk
router.post("/breast-cancer-risk", async (req, res) => {
  try {
    const { userId, riskLevel } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.breastCancerRisk = riskLevel;
    await user.save();

    res.json({ message: "Breast cancer risk saved successfully", risk: riskLevel });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Save prostate cancer risk
router.post("/prostate-cancer-risk", async (req, res) => {
  try {
    const { userId, riskLevel } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.prostateCancerRisk = riskLevel;
    await user.save();

    res.json({ message: "Prostate cancer risk saved successfully", risk: riskLevel });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Admin routes
router.get("/admin-dashboard", isAdmin, authController.adminDashboard);
router.get("/users", isAdmin, authController.viewUsers);
router.post("/users/delete/:id", isAdmin, authController.deleteUser);
// VIEW resources page FIRST
router.get("/resources", isAdmin, async (req, res) => {
  const resources = await Resource.find().sort({ createdAt: -1 });

  res.render("resources", {
    title: "Manage Resources",
    resources
  });
});

// ADD resource with image
router.post(
  "/resources/:cancerType/:category",
  isAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, content } = req.body;
      const { cancerType, category } = req.params;

      if (!req.file) {
        return res.send("Image is required");
      }

      await Resource.create({
        cancerType,
        category,
        title,
        content,
        image: `/uploads/resources/${req.file.filename}`,
        createdBy: req.session.userId
      });

      res.redirect("/resources");

    } catch (err) {
      console.error(err);
      res.status(500).send("Failed to upload resource");
    }
  }
);
router.get("/assessments", isAdmin, authController.assessmentPage);

module.exports = router;