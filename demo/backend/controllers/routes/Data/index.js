const express = require("express");
const router = express.Router();

router.get('/', async (req, res) => {
    const fs = require("fs");
    const ks = fs.readFileSync('keys.json')
    res.send(JSON.parse(ks));
})

module.exports = router;