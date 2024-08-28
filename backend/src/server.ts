import express, { Request, Response } from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth";
import cors from "cors";

const app = express();

// Apply CORS middleware before routes
app.use(
  cors({
    origin: "http://localhost:3000", // Adjust the origin as needed
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/auth", authRoutes);

// Optional: Preflight request handling (often not needed if cors middleware is configured correctly)
app.options("*", cors());

const DB_URI =
  "mongodb+srv://silunienara:siluni@cluster0.aioftrj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(DB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err: unknown) => {
    if (err instanceof Error) {
      console.error("Failed to connect to MongoDB:", err.message);
    } else {
      console.error("Failed to connect to MongoDB:", err);
    }
  });

const PORT = process.env.PORT || 5000;

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
