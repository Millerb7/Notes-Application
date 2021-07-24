const router = require('express').Router();
const path = require('path');
const fs = require('fs');

// /api/notes bc its in the /api file
router.get('/notes', (req,res) => {
    console.log('get api/notes/');
    readFromFile('./db/db.json').then((data) =>
    res.json(JSON.parse(data))
  );
});

// saves notes to json file
router.post('/notes', (req,res) => {
    console.log(req.body);
    
    const {title, text} = req.body;

    if(title && text) {
        fs.readFile('./db/db.json', (err,data) => {
            if(err) {
                console.log(err);
            } else {
                let newFile = JSON.parse(data);
                newFile.push(req.body);
                console.log(JSON.stringify(newFile));
                fs.writeFile('./db/db.json', JSON.stringify(newFile), err => {
                    if(err) {
                        console.log(err);
                    }
                });
            }
        })
    } else {
        console.log('data could not be saved missing an element!');
    }
    
});

module.exports = router;