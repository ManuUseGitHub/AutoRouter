const express = require("express");
const router = express.Router();

router.get('/', async (req, res) => {
    res.send("Howdy ! You are VIP, welcome here");
})

module.exports = router;