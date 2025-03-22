
import { DBModel } from "../interfaces";
import Questionnaire from "./questionnaire";
import ResponseModel from "./response";

Questionnaire.hasMany(ResponseModel, { foreignKey: "questionnaireId", as: "Responses" });
ResponseModel.belongsTo(Questionnaire, { foreignKey: "questionnaireId", as: "Questionnaires" });

const models: Record<string, DBModel> = { Questionnaire, ResponseModel };

export default models;
