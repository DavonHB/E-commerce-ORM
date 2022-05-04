// import requires
const express = require('express');
const routes = require('./routes');

// init
const app = express();
const PORT = process.env.PORT || 80;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

//sync sequelize to db
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})