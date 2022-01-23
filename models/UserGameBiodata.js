'use strict';
const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserGameBiodata extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  UserGameBiodata.init({
    user_id: DataTypes.INTEGER,
    nama: DataTypes.STRING,
    email: DataTypes.STRING,
    umur: DataTypes.INTEGER,
    score: DataTypes.INTEGER,
    url: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'UserGameBiodata',
  });
  return UserGameBiodata;
};
