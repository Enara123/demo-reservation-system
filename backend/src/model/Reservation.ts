import { Model, DataTypes } from "sequelize";
import sequelize from "../db";
import { User } from "./User";

class Reservation extends Model {
  public id!: number;
  public roomType!: string;
  public reservationDate!: Date;
  public name!: string;
  public contactNumber!: string;
  public paymentMethod!: string;
  public userId!: number;
}

Reservation.init(
  {
    roomType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reservationDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Reservation",
  }
);

export default Reservation;
