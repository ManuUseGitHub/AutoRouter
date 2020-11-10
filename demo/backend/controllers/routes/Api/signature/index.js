const express = require("express");
const router = express.Router();

router.get('/', async (req, res) => {
    res.send("Hello Signature here");
})

module.exports = router;