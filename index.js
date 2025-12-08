require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();

app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;


app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';   
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    } 
    
    try {
        const response = await axios.get(contacts, {headers})
        const data = response.data.results;
        res.render('contacts', {title: 'Contacs | HubSpot APIs', data})
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: "Error al obtener contactos de HubSpot" });
    }
    
});

app.get('/', async (req, res) => {
    const gamesEndpoint = 'https://api.hubapi.com/crm/v3/objects/contacts?properties=videogame_name,category_game,videogame_date';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const resp = await axios.get(gamesEndpoint, { headers });
        const data = resp.data.results;
    } catch (error) {
        console.error(err);
    }
})

app.get('/update-cobj', async (req, res) => {
    // http://localhost:3000/update?email=laguirre@quaxar.com
    const email = req.query.email;

    const getGames = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email&properties=email,videogame_name,category_game,videogame_date`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.get(getGames, { headers });
        const data = response.data;
       
        // res.json(data);
        res.render('update', {userEmail: data.properties.email, favoriteBook: data.properties.favorite_book, videoGame: data.properties.videogame_name, categoryGame: data.properties.category_game, dateGame: data.properties.videogame_date});
        
    } catch(err) {
        console.error(err);
    }
});

app.post('/update-cobj', async (req, res) => {
    const update = {
        properties: {
            "videogame_name": req.body.game,
            "category_game": req.body.categoryGame,
            "videogame_date": req.body.dateGame
        }
    }

    const email = req.query.email;
    const updateGame = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateGame, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));