const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserGames extends Model {
    /**
           * Helper method for defining associations.
           * This method is not a part of Sequelize lifecycle.
           * The `models/index` file will call this method automatically.
           */
    static associate(models) {
      UserGames.hasOne(models.UserGameBiodata, { foreignKey: 'user_id', as: 'UserGameBiodata' });
    }
  }
  UserGames.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'UserGames',
  });
  return UserGames;
};
