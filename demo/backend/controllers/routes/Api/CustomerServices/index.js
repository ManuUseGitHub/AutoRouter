const express = require("express");
const router = express.Router();

router.get('/', async (req, res) => {
    res.send("Hello Customer services just right here");
})

module.exports = router;