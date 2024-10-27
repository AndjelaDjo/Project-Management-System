const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    comment: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const taskSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['To Do', 'In Progress', 'Completed'], default: 'To Do' },
    createdOn: { type: Date, default: Date.now },
    assignedTo: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    dueDate: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Low' },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    comments: [commentSchema] 
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
