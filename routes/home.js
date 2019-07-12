var express = require('express');
var router = express.Router();
const path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var db = require('../dbConfig');

router.get('/getAllBulletin', function(req, res, next) {
	const Image = db.images;
	Image.findAll({
		order: [
        	['id', 'DESC']
        ],
        attributes: ['id', "img", "title", [db.Sequelize.fn('LEFT', db.Sequelize.col('content'), 255), 'content']]
    }).then(function (rows) {
		res.send({'Status': 1, 'Msg': 'Get data successfull.', 'Data': rows});
    }).catch(function(err) {
		res.send({'Status': 1, 'Msg': err, 'Data': null});
    });
});

router.get('/getBulletinById', function(req, res, next) {
	let bulletinId = req.query.id;
	const Image = db.images;
	const Comment = db.comments;

	Image.findOne({
		where: { id: bulletinId },
        attributes: ['id', 'img', 'title', 'content']
    }).then(function (image) {
    	//getAllComments
    	Comment.findAll({
			where: { bulletinId: bulletinId },
	        order: [ ['id', 'DESC'] ],
            attributes: ['id', 'text', 'createdAt']
	    }).then(function (comments) {
	    	let resp = image.dataValues ;
			resp['comments'] = comments;

			res.send({'Status': 1, 'Msg': 'Get data successfull.', 'Data': image});
	    }).catch(function(err) {
			res.send({'Status': 1, 'Msg': err, 'Data': null});
	    });

    }).catch(function(err) {
		res.send({'Status': 1, 'Msg': err, 'Data': null});
    });
});

module.exports = router;
