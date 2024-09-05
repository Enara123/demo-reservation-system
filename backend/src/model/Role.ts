import { DataTypes, Model } from "sequelize";
import sequelize from "../db";

export class Role extends Model {
  public id!: number;
  public role_name!: string;
}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    role_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Role",
    timestamps: false,
  }
);
