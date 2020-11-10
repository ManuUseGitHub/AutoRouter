const express = require("express");
const router = express.Router();

router.get('/', async (req, res) => {
    const file = `keys.json`;
    res.download(file); // Set disposition and send it.
})

module.exports = router;