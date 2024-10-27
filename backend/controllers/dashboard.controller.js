const Task = require('../models/task.model'); 
const Activity = require('../models/activity.model');

exports.getDashboardNumbers = async (req, res) => {
    try {
        const userId = req.user._id;

        const assignedCount = await Task.countDocuments({ status: { $in: ['To Do', 'In Progress', 'Completed'] }, assignedTo: userId });
        const inProgressCount = await Task.countDocuments({ status: 'In Progress', assignedTo: userId });
        const completedCount = await Task.countDocuments({ status: 'Completed', assignedTo: userId });
        const toDoCount = await Task.countDocuments({ status: 'To Do', assignedTo: userId });

        res.json({
            assigned: assignedCount, 
            inProgress: inProgressCount,
            completed: completedCount,
            toDo: toDoCount,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching dashboard stats' });
    }
};

exports.getRecentActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.user._id })
      .populate('taskId', 'title')
      .populate('projectId', 'name')
      .populate('userId', 'fullName')
      .sort({ timestamp: -1 }) 
      .limit(6); 

    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Error fetching activities', error });
  }
};

