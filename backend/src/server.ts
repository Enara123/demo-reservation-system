import express, { Request, Response } from "express";
import authRoutes from "./routes/auth";
import cors from "cors";
import sequelize from "./db";
import { authorize } from "./authorize";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/auth", authRoutes);

app.options("*", cors());

const PORT = process.env.PORT || 5000;

sequelize
  .sync({ force: false })
  .then(() => console.log("Database & tables created!"))
  .catch((err: any) => console.error("Error syncing database:", err));

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
