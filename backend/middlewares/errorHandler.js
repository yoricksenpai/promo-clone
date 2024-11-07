// middlewares/errorHandler.js


/**
 * Express error-handling middleware.
 * 
 * Logs the error stack to the console and sends a 500 status response with a generic error message.
 * 
 * @param {Error} err - The error object.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {Function} next - The next middleware function.
 */
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
};

export default errorHandler;