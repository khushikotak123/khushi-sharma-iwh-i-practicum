const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS_TOKEN;
const OBJECT_ID = '2-230898100';

app.get('/', async (req, res) => {

    const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT_ID}`;

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {

        const response = await axios.get(url, {
            headers,
            params: {
                properties: 'name,species,age'
            }
        });

        const data = response.data.results;

        res.render('homepage', {
            title: 'Plants Homepage',
            data
        });

    } catch (error) {
        console.error(error.response?.data || error.message);
        res.send('Error fetching plant records');
    }

});

app.get('/update-cobj', (req, res) => {

    res.render('updates', {
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
    });

});

app.post('/update-cobj', async (req, res) => {

    const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT_ID}`;

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    const newPlant = {
        properties: {
            name: req.body.name,
            species: req.body.species,
            age: req.body.age
        }
    };

    try {

        await axios.post(url, newPlant, { headers });

        res.redirect('/');

    } catch (error) {
        console.error(error.response?.data || error.message);
        res.send('Error creating plant record');
    }

});

app.listen(3000, () => {
    console.log('Listening on http://localhost:3000');
});