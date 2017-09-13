const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');


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

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});