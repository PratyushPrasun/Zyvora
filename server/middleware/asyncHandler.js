const asyncHandler = (handler) => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      console.error(error.stack); // 👈 Add this
      next(error);
    }
  };
};

export default asyncHandler;