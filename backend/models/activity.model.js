const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  type: { type: String, required: true }, 
  action: { type: String, required: true }, 
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' }, 
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' }, 
});

module.exports = mongoose.model('Activity', activitySchema);
