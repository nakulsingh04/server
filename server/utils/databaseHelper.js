// Database helper utilities to reduce repeated code

/**
 * Find a document by ID and handle not found cases
 * @param {Object} Model - Mongoose model
 * @param {string} id - Document ID
 * @param {Object} options - Additional options for findById
 * @returns {Promise<Object|null>} - Document or null if not found
 */
export const findByIdOrNull = async (Model, id, options = {}) => {
  try {
    return await Model.findById(id, options);
  } catch (error) {
    if (error.name === 'CastError') {
      return null; // Invalid ObjectId format
    }
    throw error;
  }
};

/**
 * Find a document by ID and throw error if not found
 * @param {Object} Model - Mongoose model
 * @param {string} id - Document ID
 * @param {string} resourceName - Name of the resource for error message
 * @param {Object} options - Additional options for findById
 * @returns {Promise<Object>} - Document
 * @throws {Error} - If document not found
 */
export const findByIdOrFail = async (Model, id, resourceName = 'Resource', options = {}) => {
  const document = await findByIdOrNull(Model, id, options);
  if (!document) {
    throw new Error(`${resourceName} not found`);
  }
  return document;
};

/**
 * Create a new document and handle common errors
 * @param {Object} Model - Mongoose model
 * @param {Object} data - Document data
 * @returns {Promise<Object>} - Created document
 */
export const createDocument = async (Model, data) => {
  try {
    const document = new Model(data);
    return await document.save();
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      throw new Error(`${field} already exists`);
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      throw new Error(messages.join(', '));
    }
    throw error;
  }
};

/**
 * Update a document by ID and handle common errors
 * @param {Object} Model - Mongoose model
 * @param {string} id - Document ID
 * @param {Object} data - Update data
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} - Updated document
 */
export const updateDocument = async (Model, id, data, options = {}) => {
  try {
    const document = await Model.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true, ...options }
    );
    
    if (!document) {
      throw new Error('Document not found');
    }
    
    return document;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new Error('Invalid document ID');
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      throw new Error(messages.join(', '));
    }
    throw error;
  }
};

/**
 * Delete a document by ID and handle common errors
 * @param {Object} Model - Mongoose model
 * @param {string} id - Document ID
 * @returns {Promise<Object>} - Deleted document
 */
export const deleteDocument = async (Model, id) => {
  try {
    const document = await Model.findByIdAndDelete(id);
    
    if (!document) {
      throw new Error('Document not found');
    }
    
    return document;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new Error('Invalid document ID');
    }
    throw error;
  }
};

/**
 * Find documents with pagination
 * @param {Object} Model - Mongoose model
 * @param {Object} query - Query object
 * @param {Object} options - Pagination options
 * @returns {Promise<Object>} - Paginated results
 */
export const findWithPagination = async (Model, query = {}, options = {}) => {
  const {
    page = 1,
    limit = 10,
    sort = { createdAt: -1 },
    select = null
  } = options;

  const skip = (page - 1) * limit;
  
  const [documents, total] = await Promise.all([
    Model.find(query)
      .select(select)
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Model.countDocuments(query)
  ]);

  return {
    documents,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1
    }
  };
};

/**
 * Bulk update documents
 * @param {Object} Model - Mongoose model
 * @param {Object} filter - Filter criteria
 * @param {Object} update - Update data
 * @returns {Promise<Object>} - Update result
 */
export const bulkUpdate = async (Model, filter, update) => {
  try {
    return await Model.updateMany(filter, update, { runValidators: true });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      throw new Error(messages.join(', '));
    }
    throw error;
  }
};

/**
 * Check if document exists
 * @param {Object} Model - Mongoose model
 * @param {Object} filter - Filter criteria
 * @returns {Promise<boolean>} - True if exists, false otherwise
 */
export const documentExists = async (Model, filter) => {
  const count = await Model.countDocuments(filter);
  return count > 0;
};
