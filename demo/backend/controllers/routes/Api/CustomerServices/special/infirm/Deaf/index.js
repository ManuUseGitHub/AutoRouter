const express = require("express");
const router = express.Router();

router.get('/', async (req, res) => {
    res.send("We can provide you with subtitles! Welcome here!");
})

module.exports = router;