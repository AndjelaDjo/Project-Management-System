const Team = require('../models/team.model');
const Activity = require('../models/activity.model');
const Project = require('../models/project.model'); 

// Get all teams where the user is either the creator or a member
exports.getTeams = async (req, res) => {
    try {
        const teams = await Team.find({
            $or: [
                { createdBy: req.user._id },
                { members: req.user._id }
            ]
        }).populate('members createdBy', 'fullName email name'); 
        
        if (!teams) {
            return res.status(404).json({ message: "Teams not found." });
        }
        res.json({ teams });
    } catch (error) {
        console.error("Error fetching teams:", error);
        res.status(500).json({ message: "Server error." });
    }
};


// Add a new team and log the activity
exports.addTeam = async (req, res) => {
    const { name, description, members } = req.body;
    const createdBy = req.user._id;

    if (!name || !description || !members) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const team = new Team({ name, description, members, createdBy });
        await team.save();

        // Log the activity
        await Activity.create({
            message: `Team "${team.name}" has been created`,
            type: 'team',
            action: 'created',
            userId: req.user._id,
            teamId: team._id
        });

        res.status(201).json({ message: 'Team created successfully', team });
    } catch (error) {
        console.error('Error creating team:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a team and log the activity
exports.deleteTeam = async (req, res) => {
    const teamId = req.params.teamId;

    try {
        const team = await Team.findById(teamId);

        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }

        if (team.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You do not have permission to delete this team" });
        }

        await Team.findByIdAndDelete(teamId);

        // Log the activity
        await Activity.create({
            message: `Team "${team.name}" has been deleted`,
            type: 'team',
            action: 'deleted',
            userId: req.user._id,
            teamId: team._id
        });

        res.json({ message: "Team deleted successfully" });
    } catch (error) {
        console.error("Error deleting team:", error);
        res.status(500).json({ message: "Server error." });
    }
};

// Search teams by name
exports.searchTeams = async (req, res) => {
    const searchQuery = req.query.search;
    if (!searchQuery) {
        return res.status(400).json({ message: 'Search query is required' });
    }

    try {
        const teams = await Team.find({ name: new RegExp(searchQuery, 'i') }).exec();
        if (teams.length === 0) {
            return res.status(404).json({ message: 'No teams found' });
        }
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while searching for teams', error: error.message });
    }
};

// Get a team by ID
exports.getTeamById = async (req, res) => {
    try {
        const teamId = req.params.teamId;
        const team = await Team.findById(teamId)
            .populate('members', 'fullName email role')  
            .populate('createdBy', 'fullName');

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        res.json(team);
    } catch (error) {
        console.error("Error fetching team details:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update team members and log the activity
exports.updateTeam = async (req, res) => {
    const teamId = req.params.teamId;
    const { name, description, members } = req.body;

    if (!members) {
        return res.status(400).json({ message: 'Members field is required' });
    }

    try {
        const updatedTeam = await Team.findByIdAndUpdate(
            teamId,
            { name, description, members },
            { new: true }
        );

        if (!updatedTeam) {
            return res.status(404).json({ message: 'Team not found' });
        }

        // Log the activity
        await Activity.create({
            message: `Team "${updatedTeam.name}" has been updated`,
            type: 'team',
            action: 'updated',
            userId: req.user._id,
            teamId: updatedTeam._id
        });

        res.json(updatedTeam);
    } catch (error) {
        console.error("Error updating team:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all projects for a specific team
exports.getTeamProjects = async (req, res) => {
    try {
        const teamId = req.params.teamId; 
        
        const projects = await Project.find({ teams: teamId });
        
        console.log("Projects found:", projects);
        
        if (projects.length === 0) {
            return res.status(404).json({ message: 'No projects found for this team.' });
        }

        res.status(200).json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error); 
        res.status(500).json({ error: 'Failed to fetch projects for this team.' });
    }
};