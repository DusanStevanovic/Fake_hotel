const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const url = require('url');


app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    let url = 'http://fake-hotel-api.herokuapp.com/api/hotels';

    request(url, function (err, response, body) {
        let data = JSON.parse(body);
        let error = JSON.parse(err);

        res.render('index', {
            data: data,
            error: error
        });

    });
});

app.get('/proxy/*', (req, res, next) => {
    const proxied = url.parse(req.originalUrl);

    const realUrl = 'http://fake-hotel-api.herokuapp.com/' + proxied.path.replace('/proxy/', '')
    console.log(realUrl);

    request(realUrl, function (err, response, body) {
        const apiBody = JSON.parse(response.body);
        return res.json({apiBody});
    });
});

app.listen(3001, function () {
    console.log('fake_hotel app listening on port 3000!');
});