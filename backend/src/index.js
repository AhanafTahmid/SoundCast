import express from "express";
import dotenv from "dotenv";
dotenv.config();
import {connectDB} from "./lib/db.js";//calling the function connectDB
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import songRoutes from "./routes/song.routes.js";
import albumsRoutes from "./routes/albums.routes.js";
import statsRoutes from "./routes/stats.routes.js";

const app = express();
const port = process.env.PORT;

app.use(express.json());//to parse req.body

app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumsRoutes);
app.use("/api/stats", statsRoutes);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
    connectDB();
});

