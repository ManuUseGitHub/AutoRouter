const express = require("express");
const router = express.Router();

router.get('/', async (req, res) => {
    res.send("No need to worry, we have employees who know how to speak signs language! Welcome!");
})


module.exports = router;