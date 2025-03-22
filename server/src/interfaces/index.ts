import { Model, ModelStatic  } from 'sequelize';

export interface DBModel extends ModelStatic<Model> {
    associate?: (models: Record<string, DBModel>) => void;
  }