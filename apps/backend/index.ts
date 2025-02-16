import express from "express";

const port = process.env.PORT || 8080;
const app = express();

app.get("/", (req, res) => {
  res.send("Healthy server");
});

app.get("/health", (req, res) => {
  res.send("Healthy server");
});

app.post("/ai/training", (req, res) => {
  
});
app.post("/ai/generate", (req, res) => {
  
});
app.post("/pack/generate", (req, res) => {
  
});
app.post("/pack/bulk", (req, res) => {
  
});
app.post("/image", (req, res) => {
  
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});