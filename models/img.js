module.exports = (sequelize, Sequelize) => {
  const Image = sequelize.define('image', {
    title: {
        type: Sequelize.STRING
    },
    content: {
        type: Sequelize.TEXT
    },
    type: {
        type: Sequelize.STRING
    },
    name: {
      type: Sequelize.STRING
    },
    img: {
      type: Sequelize.STRING
    }
  });
  
  return Image;
}
