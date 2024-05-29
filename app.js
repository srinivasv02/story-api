const express = require("express");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");
const Story = require("./Models/storyModel"); // Importing the story model

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/demo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(3000, () => {
      console.log("Node API running successfully");
    });
    console.log("Mongoose connected");
  })
  .catch((err) => {
    console.log(err);
  });

// Routes
app.get("/", (req, res) => {
  res.send("Server running successfully");
});

// Create a new story with validation
app.post(
  "/story",
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("content").notEmpty().withMessage("Content is required"),
    body("createdBy").notEmpty().withMessage("Created by is required"),
    body("status")
      .notEmpty()
      .withMessage("Status is required")
      .isIn(["draft", "published", "archived"])
      .withMessage("Status must be one of the following: draft, published, archived"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, content, createdBy, status } = req.body;
      const newStory = await Story.create({ title, content, createdBy, status });
      res.status(201).json(newStory);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: error.message });
    }
  }
);

// Update a story by id with validation
app.put(
  "/story/:id",
  [
    body("title").optional().notEmpty().withMessage("Title cannot be empty"),
    body("content").optional().notEmpty().withMessage("Content cannot be empty"),
    body("createdBy").optional().notEmpty().withMessage("Created by cannot be empty"),
    body("status")
      .optional()
      .isIn(["draft", "published", "archived"])
      .withMessage("Status must be one of the following: draft, published, archived"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const story = await Story.findByIdAndUpdate(id, req.body, { new: true });
      if (!story) {
        return res.status(404).json({ message: "Cannot find story by id" });
      }
      res.status(200).json(story);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: error.message });
    }
  }
);

// Delete a story by id
app.delete("/story/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const story = await Story.findByIdAndDelete(id);
    if (!story) {
      return res.status(404).json({ message: "Cannot find story by id" });
    }
    res.status(200).json(story);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

// Get all stories
app.get("/story", async (req, res) => {
  try {
    const stories = await Story.find();
    res.status(200).json(stories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a story by id
app.get("/story/:id", async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ error: "Story not found" });
    }
    res.status(200).json(story);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
