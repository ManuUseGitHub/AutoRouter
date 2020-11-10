const express = require("express");
const router = express.Router();

router.get('/', async (req, res) => {
    res.send("Welcom ! We can provide you with a lot of adapted services ! Please consider signing up :)");
})

module.exports = router;