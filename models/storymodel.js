const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['draft', 'published', 'archived'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Story = mongoose.model("Story", storySchema);

module.exports = Story;
