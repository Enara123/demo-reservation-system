import { Sequelize } from "sequelize";

const sequelize = new Sequelize("reservation_system", "root", "root", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

sequelize
  .authenticate()
  .then(() => console.log("Connected to MySQL"))
  .catch((err: any) => console.error("Unable to connect to MySQL:", err));

export default sequelize;
