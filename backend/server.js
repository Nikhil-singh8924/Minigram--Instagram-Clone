const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require('./routes/commentRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Instagram Mini Clone Backend is running");
});

app.use(express.static('public'));

app.use("/users", userRoutes);
app.use("/posts", postRoutes); 
app.use("/comments", commentRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
