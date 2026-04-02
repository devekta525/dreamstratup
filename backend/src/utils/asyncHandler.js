/**
 * Wraps an async route handler to automatically catch errors
 * and forward them to Express's next() error handler.
 *
 * @param {Function} fn - Async express route handler
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
