const Project = require('../models/project.model');
const Task = require('../models/task.model');
const Team = require('../models/team.model');

exports.search = async (req, res) => {
    const query = req.query.q;
    const userId = req.user._id;
    const type = req.query.type; // New query parameter for search type

    if (!type) {
        return res.status(400).json({ message: 'Search type is required' });
    }

    try {
        let results;

        switch (type) {
            case 'projects':
                results = await Project.find({
                    $or: [
                        { name: { $regex: query, $options: 'i' }, createdBy: userId },
                        { name: { $regex: query, $options: 'i' }, assignedTo: userId }
                    ]
                }).exec();
                break;
            case 'tasks':
                results = await Task.find({
                    $or: [
                        { title: { $regex: query, $options: 'i' }, createdBy: userId },
                        { title: { $regex: query, $options: 'i' }, assignedTo: userId }
                    ]
                }).exec();
                break;
            case 'teams':
                results = await Team.find({
                    name: { $regex: query, $options: 'i' },
                    members: userId
                }).exec();
                break;
            default:
                return res.status(400).json({ message: 'Invalid search type' });
        }

        res.status(200).json(results);
    } catch (error) {
        console.error("Error during search:", error);
        res.status(500).json({ message: 'Server error during search', error: error.message });
    }
};
