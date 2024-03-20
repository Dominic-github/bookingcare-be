'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Allcode, { foreignKey: 'positionId', targetKey: 'keyMap', as: 'positionData' })
      User.belongsTo(models.Allcode, { foreignKey: 'gender', targetKey: 'keyMap', as: 'genderData' })
      User.hasOne(models.Markdowns, { foreignKey: 'doctorId' })
      User.hasOne(models.Handbook, { foreignKey: 'userId' })
      User.hasOne(models.Doctor_Info, { foreignKey: 'doctorId' })
      User.hasMany(models.Booking, { foreignKey: 'patienId', targetKey: 'id', as: 'patientData' })
    }
  };
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    address: DataTypes.STRING,
    phonenumber: DataTypes.STRING,
    gender: DataTypes.STRING,
    image: DataTypes.TEXT,
    roleid: DataTypes.STRING,
    positionId: DataTypes.STRING,

  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};