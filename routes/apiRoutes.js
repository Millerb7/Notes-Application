const router = require('express').Router();
const path = require('path');
const fs = require('fs');

// /api/notes bc its in the /api file
router.get('/notes', (req,res) => {
    fs.readFile('./db/db.json', (err,data) => {
        if(err) {
            console.log(err);
        } else {
            if(JSON.parse(data)) {
                // there is data in the file to be gotten
                res.json(JSON.parse(data));
            } else {
                res.json('no data');
            }
        }
    });
});

// saves notes to db json file
router.post('/notes', (req,res) => {
    console.log(req.body);
    
    const {title, text} = req.body;

    if(title && text) {

        const newNote = {
            id: Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1),
            title,
            text,
        };

        fs.readFile('./db/db.json', (err,data) => {
            if(err) {
                console.log(err);
            } else if (data.length > 0){
                // data in file, adding to that data
                let newFile = JSON.parse(data);
                newFile.push(newNote);
                fs.writeFile('./db/db.json', JSON.stringify(newFile, null, 4), err => {
                    if(err) {
                        console.log(err);
                    }
                });
            } else {
                // no data in file, adding data to empty file
                fs.writeFile('./db/db.json', JSON.stringify(newNote, null, 4), err => {
                    if(err) {
                        console.log(err);
                    }
                });
            }
        });

        const response = {
            status: 'successful',
            body: newNote,
        };
        res.json(response);
    } else {
        res.json('Error in posting, data submitted miossing content');
    }
    
});

// delete note from db json file
router.delete('/notes/:id', (req,res) => {

    const id = req.params.id;
    if(id) {
        fs.readFile('./db/db.json', (err,data) => {
            if(err) {
                console.log(err);
            } else {
                let newFile = JSON.parse(data);
                // loop will iterate and delete the all notes with a title that matches :/
                for(let i = 0; i < newFile.length; i++) {
                    if(newFile[i].id === id) {
                        newFile.splice(i,1);
                        console.log(newFile);
                        // writes file after deleting notes with matching title
                        fs.writeFile('./db/db.json', JSON.stringify(newFile, null, 4), err => {
                            if(err) {
                                console.log(err);
                            }
                        });
                        res.sendFile(path.join(__dirname,'../public/notes.html'));
                    }
                }
            }
        })
    }
});

module.exports = router;