
const Project = require('../models/project.model');
const Task = require('../models/task.model');
const Activity = require('../models/activity.model');


exports.getProjects = async (req, res) => {
    try {
        const userId = req.user._id;
        const projects = await Project.find({
            $or: [
                { createdBy: userId },
                { assignedTo: userId }
            ]
        })
            .populate('createdBy', 'fullName')
            .populate('assignedTo', 'fullName email role')
            .exec();

        res.status(200).json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ message: 'An error occurred while fetching projects', error: error.message });
    }
};

exports.addProject = async (req, res) => {
    const { name, description, startDate, dueDate, status, priority, assignedTo, teams } = req.body;
    const createdBy = req.user._id;

    if (!name || !description || !startDate || !dueDate || !status || !priority || !assignedTo || !teams) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const project = new Project({ name, description, startDate, dueDate, status, priority, assignedTo, teams, createdBy });
        await project.save();

        await Activity.create({
            message: `Project "${project.name}" has been created`,
            type: 'project',
            action: 'created',
            userId: req.user._id,
            projectId: project._id
        });

        res.status(201).json({ message: 'Project created successfully', project });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteProject = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.user._id;

    try {
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (project.createdBy.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'You are not authorized to delete this project' });
        }

        await Project.findByIdAndDelete(projectId);
        await Task.deleteMany({ project: projectId });
        await Activity.create({
            message: `Project "${project.name}" has been deleted`,
            type: 'project',
            action: 'deleted',
            userId: req.user._id,
            projectId: project._id
        });

        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error("Error deleting project:", error);
        res.status(500).json({ message: 'An error occurred while deleting the project', error: error.message });
    }
};

exports.getProjectDetails = async (req, res) => {
    try {
        const projectId = req.params.id;
        const userId = req.user._id;

        const project = await Project.findById(projectId)
            .populate('createdBy', 'fullName')
            .populate('assignedTo', 'fullName email role')
            .populate({
                path: 'teams',
                populate: [
                    {
                        path: 'members',
                        select: 'fullName email role',
                    },
                    {
                        path: 'createdBy',
                        select: 'fullName',
                    }
                ],
            })
            .populate({
                path: 'tasks',
                populate: {
                    path: 'assignedTo',
                    select: 'fullName role',
                },
            })
            .select('name description startDate dueDate status priority createdBy assignedTo teams tasks files');

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const filteredTasks = project.tasks.filter(task =>
            task.assignedTo.some(user => user._id.toString() === userId.toString()) ||
            task.createdBy.toString() === userId.toString()
        );

        project.tasks = filteredTasks;

        res.status(200).json(project);
    } catch (error) {
        console.error("Error fetching project details:", error);
        res.status(500).json({ message: 'An error occurred while fetching project details', error: error.message });
    }
};

exports.editProject = async (req, res) => {
    const projectId = req.params.id;
    const { name, description, startDate, dueDate, status, priority, assignedTo, teams } = req.body;

    try {
        let project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        project.name = name || project.name;
        project.description = description || project.description;
        project.startDate = startDate || project.startDate;
        project.dueDate = dueDate || project.dueDate;
        project.status = status || project.status;
        project.priority = priority || project.priority;
        project.assignedTo = assignedTo || project.assignedTo;
        project.teams = teams || project.teams;

        await project.save();

        // Log activity
        await Activity.create({
            message: `Project "${project.name}" has been edited`,
            type: 'project',
            action: 'edited',
            userId: req.user._id,
            projectId: project._id
        });

        res.status(200).json({ message: 'Project updated successfully', project });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('assignedTo', 'fullName email role')
            .populate('teams')
            .select('name description startDate dueDate status priority assignedTo teams files'); // Ensure files is included

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json(project);
    } catch (error) {
        console.error('Error fetching project by ID:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.updateProject = async (req, res) => {
    const projectId = req.params.projectId;
    const { name, description, startDate, dueDate, status, priority, assignedTo, teams, tasks } = req.body;

    if (!name || !description || !startDate || !dueDate) {
        return res.status(400).json({ message: 'Name, description, startDate, and dueDate fields are required' });
    }

    try {
        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            {
                name,
                description,
                startDate,
                dueDate,
                status,
                priority,
                assignedTo,
                teams,
                tasks
            },
            { new: true }
        );

        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        await Activity.create({
            message: `Project "${updatedProject.name}" has been updated`,
            type: 'project',
            action: 'updated',
            userId: req.user._id,
            projectId: updatedProject._id
        });

        res.status(200).json(updatedProject);
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({ message: 'Server error' });
    }
};




