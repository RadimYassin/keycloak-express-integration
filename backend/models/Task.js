import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending',
  },
  createdBy: {
    type: String,
    required: true, // Keycloak user ID
  },
  assignedTo: String,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  dueDate: Date,
}, {
  timestamps: true,
});

taskSchema.index({ createdBy: 1 });
taskSchema.index({ status: 1 });

const Task = mongoose.model('Task', taskSchema);

export default Task;
