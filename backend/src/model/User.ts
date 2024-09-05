import { DataTypes, Model } from "sequelize";
import sequelize from "../db";
import { Role } from "./Role"; // Import the Role model

export class User extends Model {
  public id!: number;
  public username!: string;
  public password!: string;
  public roleId!: number; // Foreign key reference to Role
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
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
  },
  {
    sequelize,
    modelName: "User",
  }
);

// Set up the association
User.belongsTo(Role, { foreignKey: "roleId" });
Role.hasMany(User, { foreignKey: "roleId" });
