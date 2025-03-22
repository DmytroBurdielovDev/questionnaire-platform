import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/connection';

class ResponseModel extends Model {
    answers: any;
}

ResponseModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    questionnaireId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Questionnaires',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    answers: {
      type: DataTypes.JSON,
      allowNull: false
    },
  },
  { sequelize, modelName: 'Responses' }
);

export default ResponseModel;
