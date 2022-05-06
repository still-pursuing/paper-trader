"use strict";

import app from "./app";
import dotenv from "dotenv";

// initialize configuration
dotenv.config();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});