require("dotenv").config();
const config = require("./config.json");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors({ origin: "*" }));

// Connect to MongoDB
mongoose.connect(config.connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));

// Routes
const userRoutes = require("./routes/user.routes");
const taskRoutes = require("./routes/task.routes");
const teamRoutes = require("./routes/team.routes");
const projectRoutes=require("./routes/project.routes");
const dashboardRoutes = require('./routes/dashboard.routes');
const searchRoutes = require("./routes/search.routes");
const fileRoutes = require('./routes/file.routes');
app.use("/api", searchRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api", dashboardRoutes)
app.use('/api', fileRoutes);

app.get("/", (req, res) => {
    res.json({ data: "hello" });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

