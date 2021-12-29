const fs = require("fs");

const data = JSON.parse(fs.readFileSync("apps-declaration.json", "utf8"));

module.exports = {
  apps: data,
};
