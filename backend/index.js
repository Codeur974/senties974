const express = require("express");
const app = express();
const PORT = process.env.PORT || 4001;

app.use(express.json());
app.use(require("cors")());

app.get("/", (req, res) => {
  res.send("Backend API is working!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
