var express = require('express');
var router = express.Router();
const path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var db = require('../dbConfig');

router.get('/getAllBulletin', async (req, res, next) => {
	try {
		const Image = db.images;
		let result = await Image.findAll({
			order: [
	        	['id', 'DESC']
	        ],
	        attributes: ['id', "img", "title", [db.Sequelize.fn('LEFT', db.Sequelize.col('content'), 255), 'content']]
	    });
		res.send({'Status': 1, 'Msg': 'Get data successfull.', 'Data': result});
	} catch (err) {
		res.send({'Status': 1, 'Msg': err, 'Data': null});
	}	
});

router.get('/getBulletinById', async (req, res, next) => {
	try {
		let bulletinId = req.query.id;
		const Image = db.images;
		const Comment = db.comments;

		let images = await Image.findOne({
			where: { id: bulletinId },
	        attributes: ['id', 'img', 'title', 'content']
	    });

		//getAllComments
		let comments = await Comment.findAll({
			where: { bulletinId: bulletinId },
	        order: [ ['id', 'DESC'] ],
	        attributes: ['id', 'text', 'createdAt']
	    })

		let resp = images.dataValues ;
		resp['comments'] = comments;

		res.send({'Status': 1, 'Msg': 'Get data successfull.', 'Data': resp});
	} catch (err) {
		res.send({'Status': 1, 'Msg': err, 'Data': null});
	}

});

module.exports = router;
