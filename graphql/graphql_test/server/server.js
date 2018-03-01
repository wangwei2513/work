require('babel-core/register');
let express = require('express')

let app  = express();
let PORT = 2000;

app.get('/graphql', (req, res) => {
  res.send('Hello!');
});

let server = app.listen(PORT, function () {
  let host = server.address().address;
  let port = server.address().port;

  console.log('GraphQL listening at http://%s:%s', host, port);
});
