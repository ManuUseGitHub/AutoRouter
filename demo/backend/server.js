const express = require('express');
const app = express();

const autoRouter = require("maze-autoroute");

// ROUTES ----------------------------------------------------------
const onmatch = ({route,module}) => app.use(route, require(module));
autoRouter.getMapping({onmatch, rootp:"controllers/routes",verbose:true});
// END ROUTES ------------------------------------------------------

// Listening parameters
app.listen(4000, () => {
  console.log("Ready on port: " + 4000);
});