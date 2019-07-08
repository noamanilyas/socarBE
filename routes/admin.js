var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var multer = require('multer');

var BooksFilePath = path.resolve(__dirname, '../BookFiles/');
var AudioFilePath = path.resolve(__dirname, '../AudioFiles/');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('Admin Route is working!!');
});


router.post('/login', (req, res, next) => {
    var db = req.con;
	db.query('SELECT Id FROM user WHERE UserName = ? AND Password = ?', [req.body.UserName, req.body.Password],function(err,rows){
		if(err){
			console.log(err);
        }
        if(rows.length > 0){
            res.send({'Status': 1, 'Msg': 'Login successfull.', 'Data': rows});
        } else {
            res.send({'Status': 0, 'Msg': 'Username or password incorrect.', 'Data': null});
            
        }
	});
}); 

router.post('/addNewArticle', function(req, res, next) {
    var db = req.con;
    db.query('INSERT INTO article (Title, Text, CreatedBy) VALUES(?, ?, ?)', [req.body.Title, req.body.Text, req.body.Id],function(err,rows){
        if(err){
            console.log(err);
            res.send({'Status': 0, 'Msg': 'Something went wrong.', 'Data': null});
        } else{
            res.send({'Status': 1, 'Msg': 'Save article successfull.', 'Data': null});
        } 
    });
});

router.post('/addNewBook', function(req, res, next) {

    var form = new formidable.IncomingForm();
    
    form.parse(req);

    let fileName;

    form.on('fileBegin', function (name, file){
        fileName = file.name.replace(/ &/g,"_")
        file.path = path.join(BooksFilePath, fileName);
    });

    form.on('file', function (name, file){
        var db = req.con;
        console.log("FileName AddNewBook: ",fileName);
        db.query('INSERT INTO book (Title, FileName, CreatedBy) VALUES(?, ?, ?)', [req.query.title, fileName, req.query.id],function(err,rows){
            if(err){
                console.log(err);
                res.send({'Status': 0, 'Msg': 'Something went wrong.', 'Data': null});
            } else{
                res.send({'Status': 1, 'Msg': 'Save file successfull.', 'Data': null});
            } 
        });
    });
});

router.get('/getAllAudioFiles', function(req, res, next) {
	var db = req.con;
	db.query('SELECT * FROM audio ORDER BY Id DESC', function(err,rows){
		if(err){
			console.log(err);
			res.send({'Status': 0, 'Msg': 'Something went wrong.', 'Data': null});
		} else{
			res.send({'Status': 1, 'Msg': 'Get data successfull.', 'Data': rows});
		} 
	});
});

router.get('/getSpecificAudioFile', function(req, res, next) {
	// res.sendFile(path.join(__dirname+'/N.pdf'));
	console.log(AudioFilePath + req.query.title);
	res.sendFile(AudioFilePath + "\\" + req.query.title);
});
    
router.post('/addNewAudioFile', function(req, res, next) {
    
    var form = new formidable.IncomingForm();
    
    form.parse(req);

    form.on('fileBegin', function (name, file){
        file.path = path.join(AudioFilePath, file.name);
    });

    form.on('file', function (name, file){
        var db = req.con;
        db.query('INSERT INTO audio (Title, FileName, CreatedBy) VALUES(?, ?, ?)', [req.query.title, file.name, req.query.id],function(err,rows){
            if(err){
                console.log(err);
                res.send({'Status': 0, 'Msg': 'Something went wrong.', 'Data': null});
            } else{
                res.send({'Status': 1, 'Msg': 'Save file successfull.', 'Data': null});
            } 
        });
        
    });
});

router.post('/deleteAudioFile', function(req, res, next) {
    console.log(req.body);
    
    fs.unlink(AudioFilePath + "\\" + req.body.FileName, (err) =>{
		if (err && err.code == "'ENOENT'") {
            console.log(err);
            res.send({'Status': 0, 'Msg': 'Something went wrong.', 'Data': null});
        } else {
            var db = req.con;
            db.query('DELETE FROM audio WHERE Id = ?', [req.body.Id],function(err,rows){
                if(err){
                    console.log(err);
                    res.send({'Status': 0, 'Msg': 'Something went wrong.', 'Data': null});
                } else{
                    res.send({'Status': 1, 'Msg': 'Delete file successfull.', 'Data': null});
                } 
            });
        }
	})  
});

module.exports = router;
