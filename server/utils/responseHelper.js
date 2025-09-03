// Response helper utilities to reduce repeated code

/**
 * Send a successful API response
 * @param {Object} objectData - Object containing response parameters
 * @param {Object} objectData.res - Express response object
 * @param {any} objectData.data - Response data
 * @param {number} objectData.statusCode - HTTP status code (default: 200)
 * @param {string} objectData.message - Success message (default: "Success")
 * @param {Object} objectData.rest - Additional properties to include in response
 */
export const apiResponse = (objectData) => {
  const {
    res,
    data,
    statusCode = 200,
    message = "Success",
    ...rest
  } = objectData;
  return res.json({
    statusCode: statusCode,
    data: data,
    message: message,
    ...rest,
  });
};

/**
 * Send an error API response
 * @param {Object} objectData - Object containing error parameters
 * @param {Object} objectData.res - Express response object
 * @param {Error} objectData.error - Error object
 * @param {string} objectData.message - Error message
 * @param {number} objectData.statusCode - HTTP status code (default: 400)
 */
export const apiErrorResponse = (objectData) => {
  const { res, error, message, statusCode = 400, errors } = objectData;
  console.error(statusCode);
  const response = {
    statusCode: statusCode,
    message: message ? message : error?.message,
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  return res.status(statusCode).json(response);
};

/**
 * Send a successful response (legacy function for backward compatibility)
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code (default: 200)
 * @param {any} data - Response data
 * @param {string} message - Success message
 */
export const sendSuccess = (res, statusCode = 200, data = null, message = 'Success') => {
  return apiResponse({ res, data, statusCode, message });
};

/**
 * Send an error response (legacy function for backward compatibility)
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {string} message - Error message
 * @param {any} errors - Additional error details
 */
export const sendError = (res, statusCode = 500, message = 'Server Error', errors = null) => {
  const response = { res, message, statusCode };
  if (errors !== null) {
    response.errors = errors;
  }
  return apiErrorResponse(response);
};

/**
 * Send a "not found" response
 * @param {Object} res - Express response object
 * @param {string} resource - Name of the resource that wasn't found
 */
export const sendNotFound = (res, resource = 'Resource') => {
  return apiErrorResponse({ 
    res, 
    message: `${resource} not found`, 
    statusCode: 404 
  });
};

/**
 * Send a "validation failed" response
 * @param {Object} res - Express response object
 * @param {Array} errors - Validation errors array
 */
export const sendValidationError = (res, errors) => {
  return apiErrorResponse({ 
    res, 
    message: 'Validation failed', 
    statusCode: 400,
    errors 
  });
};

/**
 * Send a "created" response
 * @param {Object} res - Express response object
 * @param {any} data - Created resource data
 * @param {string} resource - Name of the created resource
 */
export const sendCreated = (res, data, resource = 'Resource') => {
  return apiResponse({ 
    res, 
    data, 
    statusCode: 201, 
    message: `${resource} created successfully` 
  });
};

/**
 * Send a "updated" response
 * @param {Object} res - Express response object
 * @param {any} data - Updated resource data
 * @param {string} resource - Name of the updated resource
 */
export const sendUpdated = (res, data, resource = 'Resource') => {
  return apiResponse({ 
    res, 
    data, 
    statusCode: 200, 
    message: `${resource} updated successfully` 
  });
};

/**
 * Send a "deleted" response
 * @param {Object} res - Express response object
 * @param {string} resource - Name of the deleted resource
 */
export const sendDeleted = (res, resource = 'Resource') => {
  return apiResponse({ 
    res, 
    data: null, 
    statusCode: 200, 
    message: `${resource} deleted successfully` 
  });
};
