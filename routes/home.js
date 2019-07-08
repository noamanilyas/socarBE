var express = require('express');
var router = express.Router();
const path = require('path');

var formidable = require('formidable');
var fs = require('fs');

var BooksFilePath = path.resolve(__dirname, '../BookFiles/');
var AudioFilePath = path.resolve(__dirname, '../AudioFiles/');

var db = require('../dbConfig');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Home route is working!!');
});

router.get('/getAllBooks', function(req, res, next) {
	// var db = req.con;
	// db.query('SELECT * FROM book ORDER BY Id DESC', function(err,rows){
	// 	if(err){
	// 		console.log(err);
	// 		res.send({'Status': 0, 'Msg': 'Something went wrong.', 'Data': null});
	// 	} else{
			var rows = [
			    {
					id: 3,
					title: "Loreum Ipsum",
					text: "Here",
					img: "https://cdn.fstoppers.com/styles/large-16-9/s3/lead/2018/06/ultra-wide-mistakes-lead-image.jpg"
				},
				{
					id: 4,
					title: "Winter",
					text: "Here",
					img: "https://www.canva.com/learn/wp-content/uploads/2018/12/00-winterlandscapes_featimage.jpg"
				}
		    ];
			res.send({'Status': 1, 'Msg': 'Get data successfull.', 'Data': rows});
	// 	} 
	// });
});

router.get('/getBulletinById', function(req, res, next) {
	// var db = req.con;
	// db.query('SELECT * FROM book ORDER BY Id DESC', function(err,rows){
	// 	if(err){
	// 		console.log(err);
	// 		res.send({'Status': 0, 'Msg': 'Something went wrong.', 'Data': null});
	// 	} else{
			var row = 
			    {
					id: 3,
					title: "Loreum Ipsum",
					text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
					img: "https://cdn.fstoppers.com/styles/large-16-9/s3/lead/2018/06/ultra-wide-mistakes-lead-image.jpg",
					comments: [
						{
							id: 5,
							text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
						},
						{
							id: 5,
							text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
						},
						{
							id: 5,
							text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
						},
						{
							id: 5,
							text: "here 5",
						}
					]
				};
			res.send({'Status': 1, 'Msg': 'Get data successfull.', 'Data': row});
	// 	} 
	// });
});

router.get('/getSpecificBook', function(req, res, next) {
	// res.sendFile(path.join(__dirname+'/N.pdf'));
	console.log(BooksFilePath + req.query.title);
	res.sendFile(BooksFilePath + "\\" + req.query.title);
});

router.get('/getAllArticles', function(req, res, next) {
	var db = req.con;
	db.query('SELECT * FROM article ORDER BY Id DESC', function(err,rows){
		if(err){
			console.log(err);
			res.send({'Status': 0, 'Msg': 'Something went wrong.', 'Data': null});
		} else{
			res.send({'Status': 1, 'Msg': 'Get data successfull.', 'Data': rows});
		} 
	});
});

router.post('/deleteBook', function(req, res, next) {
	
	fs.unlink(BooksFilePath + "\\" + req.body.FileName, (err) =>{
		if (err && err.code == "'ENOENT'") {
            console.log(err);
            res.send({'Status': 0, 'Msg': 'Something went wrong.', 'Data': null});
        } else {

			var db = req.con;
			db.query('DELETE FROM book WHERE Id = ?', [req.body.Id],function(err,rows){
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

router.post('/deleteArticle', function(req, res, next) {

	var db = req.con;
	db.query('DELETE FROM article WHERE Id = ?', [req.body.Id],function(err,rows){
		if(err){
			console.log(err);
			res.send({'Status': 0, 'Msg': 'Something went wrong.', 'Data': null});
		} else{
			res.send({'Status': 1, 'Msg': 'Delete file successfull.', 'Data': null});
		} 
	});
});

module.exports = router;
