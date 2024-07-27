const express = require("express"); //se llama a express para poder usarlo
const cors = require('cors');
const app = express(); //vamos a construir una app web basada en el framework express la cual sera app
const port = 3000;
const path = require('path');


require('../FresQ_Backend/server/config/sequelize.config');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const allEnrollmentRoutes = require('../FresQ_Backend/server/routes/local.routes');
const allCatRoutes = require('./server/routes/categoria.routes');
const allPackRoutes = require('./server/routes/pack.routes');
const allPedidoRoutes = require('./server/routes/pedido.route');
const imageRouter = require('./server/routes/imagen.routes');
const allClienteRoutes = require ('./server/routes/cliente.route');
allCatRoutes(app);
allEnrollmentRoutes(app);
allPackRoutes(app);
allPedidoRoutes(app);
allClienteRoutes(app);
imageRouter(app);


// Configuración para servir archivos estáticos desde mediafiles
app.use('/mediafiles', express.static(path.join(__dirname, 'mediafiles')));


app.listen(port, () => {
console.log("Server listening at port", port);
})