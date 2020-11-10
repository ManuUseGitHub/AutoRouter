const express = require("express");
const router = express.Router();

router.get('/', async (req, res) => {
    res.send("Hello ! That section is in development for now. We put efforts on handling every one ! Because every one is special and unique !");
})

module.exports = router;