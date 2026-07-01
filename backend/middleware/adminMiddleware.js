export const admin = (req, res, next) => {
  if (req.user?.isAdmin) {
    next();
    return;
  }

  res.status(403);
  next(new Error("Admin access required"));
};
