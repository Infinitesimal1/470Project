
const mongoose = require("mongoose");
const { Schema } = mongoose;

const CourseSchema = new Schema(
  {
    
    courseCode: { type: Number, required: true, unique: true },

    courseName:        { type: String, required: true },
    courseDescription: { type: String, default: "" },

    lessons: [{ type: Schema.Types.ObjectId, ref: "Lesson" }],
  },
  { timestamps: true }
);

module.exports = mongoose.models.Course || mongoose.model("Course", CourseSchema);
