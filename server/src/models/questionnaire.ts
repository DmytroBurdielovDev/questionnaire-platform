import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/connection';

class Questionnaire extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public questions!: object[];
  public completionsCount!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Questionnaire.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    questions: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    completionsCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
  },
  {
    sequelize,
    tableName: 'Questionnaires',
  }
);

export default Questionnaire;