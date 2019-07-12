module.exports = (sequelize, Sequelize) => {
  const Comment = sequelize.define('comment', {
    text: {
        type: Sequelize.TEXT
    },
    bulletinId: {
        type: Sequelize.INTEGER,
        references: 'bulletin', 
        referencesKey: 'id'
    }
  });
  
  return Comment;
}