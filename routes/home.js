import { Router } from 'express';
let router = Router();
import path from 'path';
import formidable from 'formidable';
import fs from 'fs';

import { images as _images, Sequelize, comments as _comments } from '../dbConfig';

router.get('/getAllBulletin', async (req, res, next) => {
	try {
		const Image = _images;
		let result = await Image.findAll({
			order: [
	        	['id', 'DESC']
	        ],
	        attributes: ['id', "img", "title", [Sequelize.fn('LEFT', Sequelize.col('content'), 255), 'content']]
	    });
		res.send({'Status': 1, 'Msg': 'Get data successfull.', 'Data': result});
	} catch (err) {
		res.send({'Status': 1, 'Msg': err, 'Data': null});
	}	
});

router.get('/getBulletinById', async (req, res, next) => {
	try {
		let bulletinId = req.query.id;
		const Image = _images;
		const Comment = _comments;

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

export default router;
