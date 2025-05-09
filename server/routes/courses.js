
const router  = require("express").Router();
const Course  = require("../models/Course");


const verifyToken = (_req, _res, next) => next();


async function getNextCode() {
  const last = await Course.findOne().sort({ courseCode: -1 });
  return last ? last.courseCode + 1 : 1;
}


router.get("/", async (_req, res) => {
  try {
    const list = await Course.find().sort({ courseCode: 1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/:code", async (req, res) => {
  try {
    const course = await Course.findOne({ courseCode: Number(req.params.code) });
    if (!course) return res.status(404).json({ message: "Not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post("/", verifyToken, async (req, res) => {
  try {
    const { courseName, courseDescription } = req.body;
    if (!courseName || !courseDescription)
      return res.status(400).json({ message: "Both fields required" });

    const courseCode = await getNextCode();
    const newCourse  = await Course.create({ courseCode, courseName, courseDescription });
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put("/:code", verifyToken, async (req, res) => {
  try {
    const updated = await Course.findOneAndUpdate(
      { courseCode: Number(req.params.code) },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.delete("/:code", verifyToken, async (req, res) => {
  try {
    const gone = await Course.findOneAndDelete({ courseCode: Number(req.params.code) });
    if (!gone) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
