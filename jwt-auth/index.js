const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

const JWT_SECRET = "asdlfahdlfhasdlhfldhf";
const USERS = [
  { email: "dhavalchangani@gmail.com", password: "123", userName: "Dhaval Changani" },
  { email: "nikitaVayas@gmail.com", password: "123", userName: "Nikita Vyas" },
  { email: "harshvyad@gmail.com", password: "123", userName: "Harsh Vyas" },
];

app.use(express.json());

app.get("/", function (req, res) {
  res.status(200).send("Hello There");
});

function userExists(userName, password) {
  return USERS.findIndex((user) => user.userName === userName && user.password === password) > -1;
}

app.post("/signin", function (req, res) {
  const { userName, password } = req.body;

  if (!userExists(userName, password)) {
    res.status(403).json({ msg: "User does not exists, please check login information again!" });
    return;
  }

  console.log("check");
  const token = jwt.sign({ userName }, JWT_SECRET);
  res.status(200).json({ token });
});

app.get("/users", function (req, res) {
  try {
    const authorization = req.headers.authorization;
    const token = authorization.split(" $")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const userName = decoded.userName;
    const restOfUsers = USERS.filter((user) => user.userName !== userName);
    res.status(200).json({ users: restOfUsers });
  } catch (error) {
    res.status(403).json({ msg: "invalid token" });
  }
});

app.listen(3000);
