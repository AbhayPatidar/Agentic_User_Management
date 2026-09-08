import "dotenv/config";
import { createServer } from "http";
import app from "./src/app.js";
import { initSocket } from "./src/socket/index.js";
import { connectDB } from "./src/config/db.js";

const httpServer = createServer(app);
initSocket(httpServer);

await connectDB();

httpServer.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
