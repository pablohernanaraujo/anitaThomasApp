const Express = require('express');
const app = Express();

app.use(Express.static('static'));
app.listen(process.env.PORT || 5000);