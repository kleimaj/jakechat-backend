const config = require('./config');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const pino = require('express-pino-logger')();
const { videoToken } = require('./tokens');

const corsOptions = {
  // origin: ['http://localhost:3000'],
  origin: [process.env.CLIENT_URL],
  methods: "GET,POST,PUT,DELETE",
  credentials: true, //allows session cookies to be sent back and forth
  optionsSuccessStatus: 200 //legacy browsers
}

const app = express();

// middleware

//CORS- Cross Origin Resource Sharing
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(pino);

app.use((req, res, next) => {
  const url = req.url;
  const method = req.method;

  // Destructuring
  // const { url, method } = req;

  const requestedAt = new Date().toLocaleTimeString();
  const result = `${method} ${url} ${requestedAt}`;
  console.log(result);

  next();
});


const sendTokenResponse = (token, res) => {
  res.set('Content-Type', 'application/json');
  res.send(
    JSON.stringify({
      token: token.toJwt()
    })
  );
};

app.get('/api/greeting', (req, res) => {
  const name = req.query.name || 'World';
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});

app.get('/video/token', (req, res) => {
  // console.log(req.query)
  const identity = req.query.identity;
  const room = req.query.room;
  const token = videoToken(identity, room, config);
  sendTokenResponse(token, res);
});

app.post('/video/token', (req, res) => {
  const identity = req.body.identity;
  const room = req.body.room;
  const token = videoToken(identity, room, config);
  sendTokenResponse(token, res);
});

app.listen(process.env.PORT || 3001, () =>
  console.log('Express server is running on localhost:3001')
);
