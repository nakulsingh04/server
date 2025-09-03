import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [100, 'Task title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Task description cannot exceed 500 characters']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['todo', 'inProgress', 'done'],
    default: 'todo'
  },
  columnId: {
    type: String,
    required: [true, 'Column ID is required'],
    enum: ['todo', 'inProgress', 'done']
  },
  position: {
    type: Number,
    default: 0
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tags: [{
    type: String,
    trim: true
  }],
  dueDate: {
    type: Date
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
taskSchema.index({ columnId: 1, position: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ createdBy: 1 });
taskSchema.index({ status: 1 });

// Virtual for task age
taskSchema.virtual('age').get(function() {
  return Date.now() - this.createdAt;
});

// Pre-save middleware to update position if not provided
taskSchema.pre('save', async function(next) {
  if (this.isNew && this.position === 0) {
    const lastTask = await this.constructor.findOne({ columnId: this.columnId })
      .sort({ position: -1 });
    this.position = lastTask ? lastTask.position + 1 : 0;
  }
  next();
});

// Static method to get tasks by column
taskSchema.statics.getTasksByColumn = function(columnId) {
  return this.find({ columnId }).sort({ position: 1 });
};

// Static method to update task positions
taskSchema.statics.updatePositions = async function(columnId, taskIds) {
  const bulkOps = taskIds.map((taskId, index) => ({
    updateOne: {
      filter: { _id: taskId },
      update: { position: index }
    }
  }));
  
  return this.bulkWrite(bulkOps);
};

export default mongoose.model('Task', taskSchema);
