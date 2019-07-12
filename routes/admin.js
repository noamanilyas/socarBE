var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var db = require('../dbConfig');

var ImagesPath = path.resolve(__dirname, '../public/images/');

router.post('/addBulletin', (req, res, next) => {

    var form = new formidable.IncomingForm();
    
    form.parse(req);

    let fields = {};

    form.on('fileBegin', (name, file) => {
        fields['name'] = file.name;
        var date = Date.now();
        file.path = path.join(ImagesPath, date + fields.name);
        fields['img'] = path.join(ImagesPath, date + fields.name);
        fields['type'] = file.type;
        fields['path'] = '/images/' + date + fields.name;
    });

    form.on('field', (name, value) => {
        fields[name] = value;
    });

    form.on('end', async () => {
        console.log(fields.content);
        const Image = db.images;

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
                attributes: ['id', "img", "title", [db.Sequelize.fn('LEFT', db.Sequelize.col('content'), 255), 'content']]
            })
            res.send({'Status': 1, 'Msg': 'Get data successfull.', 'Data': results});
        } catch (err) {
            res.send({'Status': 1, 'Msg': err, 'Data': null});
        }
    });
});

router.post('/addNewComment', async (req, res, next) => {

    var text = req.body.text;
    var bulletinId = req.body.bulletinId;

    const Comment = db.comments;

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

module.exports = router;
