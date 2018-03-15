const app = require('./app');
const { PORT } = require('./config');

app.listen(PORT, err => {
  if (err) console.log(err);
  else console.log(`App listening on port ${PORT}`, process.env.NODE_ENV);
});
