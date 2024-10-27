const Task = require('../models/task.model');
const Project = require('../models/project.model');
const Activity = require('../models/activity.model');
const User = require('../models/user.model');


exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({
            $or: [
                { createdBy: req.user._id },
                { assignedTo: req.user._id }
            ]
        })
        .populate('assignedTo createdBy', 'fullName email')
        .populate('project', 'name'); 

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tasks", error });
    }
};


exports.addTask = async (req, res) => {
    const { title, description, status, assignedTo, dueDate, priority, project } = req.body;
    const createdBy = req.user._id;

    if (!title || !description || !status || !assignedTo || !dueDate || !priority || !project) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const task = new Task({ title, description, status, assignedTo, dueDate, priority, createdBy, project });
        await task.save();

        await Project.findByIdAndUpdate(project, { $push: { tasks: task._id } });

        // Logging the activity
        await Activity.create({
            message: `Task "${task.title}" has been created`,
            type: 'task',
            action: 'created',
            userId: req.user._id,
            taskId: task._id,
            projectId: project
        });

        res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete task
exports.deleteTask = async (req, res) => {
    const taskId = req.params.taskId;
    const userId = req.user._id;

    try {
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Check if the current user is the creator of this task
        if (task.createdBy.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'You are not authorized to delete this task. Only the creator can delete it.' });
        }

        await Project.findByIdAndUpdate(task.project, { $pull: { tasks: taskId } });
        await Task.findByIdAndDelete(taskId);

        // Log activity
        await Activity.create({
            message: `Task "${task.title}" has been deleted`,
            type: 'task',
            action: 'deleted',
            userId: req.user._id,
            taskId: task._id,
            projectId: task.project
        });

        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


exports.searchTasks = async (req, res) => {
    const query = req.query.query;
    try {
        const tasks = await Task.find({ title: { $regex: query, $options: 'i' } });
        res.json({ tasks });
    } catch (error) {
        console.error("Error searching tasks:", error);
        res.status(500).json({ message: "Server error." });
    }
};

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({});
        res.status(200).json(projects);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.editTask = async (req, res) => {
    const { title, description, status, assignedTo, dueDate, priority, project } = req.body;
    const taskId = req.params.taskId;

    if (!title || !description || !status || !assignedTo || !dueDate || !priority || !project) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const task = await Task.findByIdAndUpdate(
            taskId,
            { title, description, status, assignedTo, dueDate, priority, project },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Log the activity
        await Activity.create({
            message: `Task "${task.title}" has been updated`,
            type: 'task',
            action: 'updated',
            userId: req.user._id,
            taskId: task._id,
            projectId: task.project
        });

        res.status(200).json({ message: 'Task updated successfully', task });
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ message: 'Error updating task', error });
    }
};

exports.getTaskDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id)
            .populate('assignedTo', 'fullName role email')
            .populate('createdBy', 'fullName')
            .populate('project', 'name');

        if (!task) {
            console.log('Task not found');
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        console.error('Error fetching task details:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.updateTask = async (req, res) => {
    const taskId = req.params.taskId;
    const { title, description, startDate, dueDate, priority, status, assignedTo } = req.body;

    if (!Array.isArray(assignedTo) || assignedTo.length === 0) {
        return res.status(400).json({ message: 'Assigned users field is required' });
    }

    try {
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            {
                title,
                description,
                startDate,
                dueDate,
                priority,
                status,
                assignedTo // Matches the schema
            },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Log the activity
        await Activity.create({
            message: `Task "${updatedTask.title}" has been updated`,
            type: 'task',
            action: 'updated',
            userId: req.user._id,
            taskId: updatedTask._id
        });

        res.json(updatedTask);
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

/*exports.updateProject = async (req, res) => {
    const projectId = req.params.projectId;
    const { name, description, startDate, dueDate, status, priority, assignedTo, teams } = req.body;

    if (!name || !description || !startDate || !dueDate || !status || !priority || !assignedTo || !teams) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            { name, description, startDate, dueDate, status, priority, assignedTo, teams },
            { new: true }
        );

        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Log the activity
        await Activity.create({
            message: `Project "${updatedProject.name}" has been updated`,
            type: 'project',
            action: 'updated',
            userId: req.user._id,
            projectId: updatedProject._id
        });

        res.json(updatedProject);
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({ message: 'Server error' });
    }
};*/

exports.addComment = async (req, res) => {
    const { taskId } = req.params;
    const { comment } = req.body; 

    try {
        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        const newComment = {
            user: req.user._id, 
            comment: comment,
        };

        task.comments.push(newComment);
        await task.save();

        const populatedTask = await Task.findById(taskId).populate('comments.user', 'fullName');

        await Activity.create({
            message: `A new comment has been added to task "${task.title}"`,
            type: 'task',
            action: 'comment_added',
            userId: req.user._id,
            taskId: task._id,
            projectId: task.project
        });

        res.status(201).json(populatedTask.comments[populatedTask.comments.length - 1]);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getComments = async (req, res) => {
    const { taskId } = req.params;

    try {
        const task = await Task.findById(taskId).populate('comments.user', 'fullName');
        if (!task) return res.status(404).json({ message: 'Task not found' });

        res.json(task.comments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching comments', error });
    }
};