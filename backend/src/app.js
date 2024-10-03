const express = require('express');
const connectMongo = require('./config/database.config');
const cors = require('cors');
const redis = require('./config/redis.config');
const apis = require('./routes/index');


const PORT = process.env.PORT || 8000;
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/v1/did', apis.didRouter);
app.use('/api/v1/verifier', apis.vcRouter);
// app.use('/api/v1/aa', apis.AARouter);

connectMongo();
// async function connectRedis() {
//   try {
//     await redis.connect();
//   } catch (error) {
//     console.error(error);
//   }
// }
// connectRedis();


// global error handling
app.use((err, _req, res, next) => {
  console.error(err.stack);
  res.status(500).send(err.message);
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;