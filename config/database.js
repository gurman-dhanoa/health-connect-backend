const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const connectDatabse = () => {
  mongoose.connect(process.env.DB_URI).then((data) => {
    console.log(`Database connected successfully... `);
  });
};

module.exports = connectDatabse;
