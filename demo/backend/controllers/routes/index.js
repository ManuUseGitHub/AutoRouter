const express = require("express");
const router = express.Router();

router.get('/', async (req, res) => {
    const text = 
        "Hello world! Have you ever thought about a way to set routes in express with ease but just by only creating router based modules in a designated folder tree?<br/><br/>"+
        "It can sound strange but imagine that creating routes only relying on creating index.js files in a structured folder tree and that structures reflects your route tree!<br/><br/>"+
        "It could be as simple as : Folder <=> routes automatically <br/><br/>"+
        "I frameworked it for you with just few lines and a AutoRouter module :) ! Please check it out !"
    res.send(text);

})

module.exports = router;