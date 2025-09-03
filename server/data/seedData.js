import Task from '../models/Task.js';
import User from '../models/User.js';

const seedUsers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=3b82f6&color=fff'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user',
    avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=10b981&color=fff'
  },
  {
    name: 'Mike Johnson',
    email: 'mike@example.com',
    password: 'password123',
    role: 'user',
    avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=f59e0b&color=fff'
  },
  {
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    password: 'password123',
    role: 'user',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Wilson&background=ef4444&color=fff'
  }
];

const seedTasks = [
  // Todo Column
  {
    title: 'Design new landing page',
    description: 'Create a modern and responsive landing page design for the new product launch',
    priority: 'high',
    columnId: 'todo',
    position: 0,
    tags: ['design', 'frontend', 'landing-page'],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  },
  {
    title: 'Set up CI/CD pipeline',
    description: 'Configure automated testing and deployment pipeline for the project',
    priority: 'medium',
    columnId: 'todo',
    position: 1,
    tags: ['devops', 'automation', 'ci-cd'],
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
  },
  {
    title: 'Write API documentation',
    description: 'Create comprehensive API documentation with examples and use cases',
    priority: 'low',
    columnId: 'todo',
    position: 2,
    tags: ['documentation', 'api', 'technical-writing'],
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) // 10 days from now
  },
  {
    title: 'Plan team meeting agenda',
    description: 'Prepare agenda and materials for the weekly team meeting',
    priority: 'medium',
    columnId: 'todo',
    position: 3,
    tags: ['meeting', 'planning', 'team'],
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
  },

  // In Progress Column
  {
    title: 'Implement user authentication',
    description: 'Build secure user authentication system with JWT tokens and password hashing',
    priority: 'high',
    columnId: 'inProgress',
    position: 0,
    tags: ['authentication', 'security', 'backend'],
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
  },
  {
    title: 'Create database schema',
    description: 'Design and implement the database schema with proper relationships and indexes',
    priority: 'high',
    columnId: 'inProgress',
    position: 1,
    tags: ['database', 'schema', 'backend'],
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000) // 4 days from now
  },
  {
    title: 'Write unit tests',
    description: 'Create comprehensive unit tests for all core functionality',
    priority: 'medium',
    columnId: 'inProgress',
    position: 2,
    tags: ['testing', 'unit-tests', 'quality'],
    dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000) // 6 days from now
  },

  // Done Column
  {
    title: 'Project setup and configuration',
    description: 'Initialize project structure and configure development environment',
    priority: 'medium',
    columnId: 'done',
    position: 0,
    tags: ['setup', 'configuration', 'project'],
    isCompleted: true,
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  },
  {
    title: 'Create project requirements document',
    description: 'Document all project requirements and specifications',
    priority: 'high',
    columnId: 'done',
    position: 1,
    tags: ['documentation', 'requirements', 'planning'],
    isCompleted: true,
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    title: 'Set up version control',
    description: 'Initialize Git repository and set up branching strategy',
    priority: 'low',
    columnId: 'done',
    position: 2,
    tags: ['git', 'version-control', 'setup'],
    isCompleted: true,
    completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
  }
];

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Task.deleteMany({});
    await User.deleteMany({});

    // Create users
    const createdUsers = [];
    for (const userData of seedUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
    }

    // Create tasks with assigned users
    for (let i = 0; i < seedTasks.length; i++) {
      const taskData = seedTasks[i];
      const assignedUser = createdUsers[i % createdUsers.length]; // Distribute tasks among users
      
      const task = new Task({
        ...taskData,
        assignedTo: assignedUser._id,
        createdBy: createdUsers[0]._id // Admin creates all tasks
      });
      
      await task.save();
    }
    
    return {
      users: createdUsers,
      tasks: seedTasks.length
    };
  } catch (error) {
    throw error;
  }
};

const clearDatabase = async () => {
  try {
    await Task.deleteMany({});
    await User.deleteMany({});
  } catch (error) {
    throw error;
  }
};

export {
  seedDatabase,
  clearDatabase,
  seedUsers,
  seedTasks
};
