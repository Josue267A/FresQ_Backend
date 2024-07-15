const express = require("express"); //se llama a express para poder usarlo
const cors = require('cors');
const app = express(); //vamos a construir una app web basada en el framework express la cual sera app
const port = 5000;

require('../FresQ_Backend/server/config/sequelize.config');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const allEnrollmentRoutes = require('../FresQ_Backend/server/routes/local.routes');
//const allUserRoutes = require('./server/routes/user.routes.js');
allUserRoutes(app);
allEnrollmentRoutes(app);
app.listen(port, () => {
console.log("Server listening at port", port);
})