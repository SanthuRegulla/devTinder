const authAdmin = (req, res, next) => {
  const token = "xyz"; // Replace with actual token retrieval logic
  const isAdminAuthorized = token === "xyz";
  if (!isAdminAuthorized) {
    return res.status(401).send("Unauthorized");
  } else {
    console.log("Admin authorized");
    next();
  }
};

const authUser = (req, res, next) => {
  const token = "xyz"; // Replace with actual token retrieval logic
  const isAdminAuthorized = token === "xyz";
  if (!isAdminAuthorized) {
    return res.status(401).send("Unauthorized");
  } else {
    console.log("User authorized");
    next();
  }
};

module.exports = {
  authAdmin,
  authUser,
};
