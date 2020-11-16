const express = require('express');
const autoroute = require('maze-autoroute');
const app = express();

// ROUTES ----------------------------------------------------------
const onmatch = ({route,module}) => app.use(route, require(module));
autoroute.getMapping({onmatch, rootp:"controllers/routes",verbose:true});
// END ROUTES ------------------------------------------------------

// Listening parameters
app.listen(4000, () => {
  console.log("Ready on port: " + 4000);
});