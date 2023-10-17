const fs = require("fs");
const { resolve } = require("path");
const routesFolder = resolve("./routes");

function camelCaseToDash(myStr) {
  return myStr.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

// helper function to get all routes path
const getAllRoutesPath = function () {
  const allRoutesPath = [];

  fs.readdirSync(routesFolder).forEach((file) => {
    const fullPath = `${routesFolder}/${file}`;
    if (fs.existsSync(fullPath) && fullPath.endsWith(".route.js")) {
      allRoutesPath.push({
        fullPath: fullPath.replace(".js", ""),
        fileName: file.replace(".route.js", ""),
      });
    }
  });
  return allRoutesPath;
};

// main function to register all routes
const registerRoutes = function (expressInstance) {
  const allRoutesPath = getAllRoutesPath();
  // load all nested routes file
  for (const routeFile of allRoutesPath) {
    const router = require(routeFile.fullPath);
    expressInstance.use(`/api/${camelCaseToDash(routeFile.fileName)}`, router);
  }
};

module.exports = {
  registerRoutes,
};
