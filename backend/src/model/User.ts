import { DataTypes, Model } from "sequelize";
import sequelize from "../db";
import { Role } from "./Role"; // Import the Role model

export class User extends Model {
  public id!: number;
  public email!: string;
  public password!: string;
  public roleId!: number;
  public otp!: string | null;
  public otpExpiresAt!: Date | null;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roleId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Role, // 'Role' would also work
        key: "id",
      },
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otpExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "User",
  }
);

// Set up the association
User.belongsTo(Role, { foreignKey: "roleId" });
Role.hasMany(User, { foreignKey: "roleId" });
