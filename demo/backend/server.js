const express = require('express');
const app = express();

const autoRouter = require("./AutoRouter");

// Routes
// seek into [path : controllers/routes] and map routes according to the folder tree

const autoRouterOptions = {
  onmatch : (e) => {
    app.use(e.route, require(e.module));
  },
}

// returns a list of {route,module} and callbacks 'onmatch' option
autoRouter.getMapping(autoRouterOptions);

// Listening parameters
app.listen(4000, () => {
  console.log("Ready on port: " + 4000);
});