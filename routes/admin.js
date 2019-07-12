import { Router } from 'express';
let router = Router();
import { IncomingForm } from 'formidable';
import fs from 'fs';
import { resolve, join } from 'path';

import { images, Sequelize, comments } from '../dbConfig';

let ImagesPath = resolve(__dirname, '../public/images/');

router.post('/addBulletin', (req, res, next) => {

    let form = new IncomingForm();
    
    form.parse(req);

    let fields = {};

    form.on('fileBegin', (name, file) => {
        fields['name'] = file.name;
        let date = Date.now();
        file.path = join(ImagesPath, date + fields.name);
        fields['img'] = join(ImagesPath, date + fields.name);
        fields['type'] = file.type;
        fields['path'] = '/images/' + date + fields.name;
    });

    form.on('field', (name, value) => {
        fields[name] = value;
    });

    form.on('end', async () => {
        console.log(fields.content);
        const Image = images;

        const image = Image.build({
            title: fields.title,
            content: fields.content,
            name: fields.name,
            type: fields.type,
            img: fields.path
        });

        try {
            let createRecord = await image.save();
            let results = await Image.findAll({
                order: [ ['id', 'DESC'] ],
                attributes: ['id', "img", "title", [Sequelize.fn('LEFT', Sequelize.col('content'), 255), 'content']]
            })
            res.send({'Status': 1, 'Msg': 'Get data successfull.', 'Data': results});
        } catch (err) {
            res.send({'Status': 1, 'Msg': err, 'Data': null});
        }
    });
});

router.post('/addNewComment', async (req, res, next) => {

    let text = req.body.text;
    let bulletinId = req.body.bulletinId;

    const Comment = comments;

    const comment = Comment.build({
        text: text,
        bulletinId: bulletinId
    });

    try {
        let createRecord = await comment.save();
        let results = await Comment.findAll({
                order: [ ['id', 'DESC'] ],
                attributes: ['id', "text", "createdAt"],
                where: { bulletinId: bulletinId }
            })
        res.send({'Status': 1, 'Msg': 'Get data successfull.', 'Data': results});
    } catch (err) {
        res.send({'Status': 1, 'Msg': err, 'Data': null});
    }
});

export default router;
