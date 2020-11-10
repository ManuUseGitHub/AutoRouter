const express = require("express");
const router = express.Router();

router.get('/', async (req, res) => {
    res.send("You might not be able to see this but welcome :) ! We can provide you with a lot of alternatives to be clear to you upon our services. We put a lot of efforts to be open to blind people :)");
})

module.exports = router;