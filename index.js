const Express = require('express');
const app = Express();

app.use(Express.static('static'));
app.listen(7000);