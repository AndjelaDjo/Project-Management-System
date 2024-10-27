const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ['Not Started', 'In Progress', 'Completed', 'On Hold'], default: 'Not Started' },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    assignedTo: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
    files: [{
        fileName: String,
        filePath: String
    }]
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
