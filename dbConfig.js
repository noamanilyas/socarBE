var DATABASE_NAME = 'bulletin';
var DB_USERNAME = 'root';
var DB_PASSWORD = '';

var Sequelize = require('sequelize');
var FS = require('fs');

var sequelize = new Sequelize(
	DATABASE_NAME, 
	DB_USERNAME, 
	DB_PASSWORD, {
		host:'localhost',
		port:3306,
		dialect:'mysql',
		define: {
			freezeTableName: true
		}
});

//Connect to Database
sequelize.authenticate().then(function (e) {
	if(e) {
		console.log('There is connection ERROR');
	} else {
		console.log('Connection has been established successfully');
	}
});

const db = {};
 
db.Sequelize = Sequelize;
db.sequelize = sequelize;
 
db.images = require('./models/img.model.js')(sequelize, Sequelize);
db.comments = require('./models/comment.model.js')(sequelize, Sequelize);
 
module.exports = db;