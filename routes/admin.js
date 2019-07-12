var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var db = require('../dbConfig');

var ImagesPath = path.resolve(__dirname, '../public/images/');

router.post('/addBulletin', function(req, res, next) {

    var form = new formidable.IncomingForm();
    
    form.parse(req);

    let fields = {};

    form.on('fileBegin', function (name, file){
        fields['name'] = file.name;
        var date = Date.now();
        file.path = path.join(ImagesPath, date + fields.name);
        fields['img'] = path.join(ImagesPath, date + fields.name);
        fields['type'] = file.type;
        fields['path'] = '/images/' + date + fields.name;
    });

    form.on('field', function (name, value){
        fields[name] = value;
    });

    form.on('end', function() {
        console.log(fields.content);
        const Image = db.images;

        const image = Image.build({
            title: fields.title,
            content: fields.content,
            name: fields.name,
            type: fields.type,
            img: fields.path
        });

        image.save().then(() => {
            const Image = db.images;
            Image.findAll({
                order: [ ['id', 'DESC'] ],
                attributes: ['id', "img", "title", [db.Sequelize.fn('LEFT', db.Sequelize.col('content'), 255), 'content']]
            }).then(function (rows) {
                res.send({'Status': 1, 'Msg': 'Get data successfull.', 'Data': rows});
            }).catch(function(err) {
                res.send({'Status': 1, 'Msg': err, 'Data': null});
            });
            // res.send({'Status': 1, 'Msg': 'Image is saved.', 'Data': null});
        }).catch(error => {
            res.send({'Status': 0, 'Msg': 'Image is not saved.', 'Data': null});
        });


        // db.sequelize.sync({force: true}).then(() => {
        //   //Give any image name here.
        //   Image.create({
        //     title: fields.title,
        //     content: fields.content,
        //     name: files.upload.name.replace(/ &/g,"_"),
        //     type: files.upload.type,
        //     img: imageData
        //   }).then(image => {
        //     try{
        //         res.send({'Status': 0, 'Msg': 'Something went wrong.', 'Data': image});
        //       // fs.writeFileSync(__dirname + '/static/assets/tmp/tmp-jsa-header.png', image.data);    
              
        //       // exit node.js app
        //       process.exit(0);
        //     }catch(e){
        //       console.log(e);
        //     }
        //   })
        // });
    });
});

router.post('/addNewComment', function(req, res, next) {


    var text = req.body.text;
    var bulletinId = req.body.bulletinId;

    const Comment = db.comments;

    const image = Comment.build({
        text: text,
        bulletinId: bulletinId
    });

    image.save().then(() => {
        Comment.findAll({
            order: [ ['id', 'DESC'] ],
            attributes: ['id', "text", "createdAt"],
            where: { bulletinId: bulletinId }
        }).then(function (rows) {
            res.send({'Status': 1, 'Msg': 'Get data successfull.', 'Data': rows});
        }).catch(function(err) {
            res.send({'Status': 1, 'Msg': err, 'Data': null});
        });
        // res.send({'Status': 1, 'Msg': 'Image is saved.', 'Data': null});
    }).catch(error => {
        res.send({'Status': 0, 'Msg': 'Image is not saved.', 'Data': null});
    });

    // db.sequelize.sync({force: true}).then(() => {
    //   //Give any image name here.
    //   Comment.create({
    //     text: req.body.text,
    //     bulletinId: req.body.bulletinId
    //   }).then(comment => {
    //     try{
    //         res.send({'Status': 1, 'Msg': 'Comment is saved.', 'Data': comment});
    //         process.exit(0);
    //     }catch(e){
    //         res.send({'Status': 0, 'Msg': 'Something went wrong.', 'Data': null});
    //       console.log(e);
    //     }
    //   })
    // });
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
