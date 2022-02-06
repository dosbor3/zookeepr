const express = require("express"); //Remember to always use require when adding npm packages, and express is a npm package

const {animals} = require("./data/animals");

const PORT = process.env.PORT || 3001;


//2 step process to set up the server, instantiate the server, then tell it to listen for requests
const app = express();  //Instantiate the server, step 1

// app.get("/api/animals", (req, res) => {
//     res.json(animals);
// });

function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    // Note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
      // Save personalityTraits as a dedicated array.
      // If personalityTraits is a string, place it into a new array and save.
      if (typeof query.personalityTraits === 'string') {
        personalityTraitsArray = [query.personalityTraits];
      } else {
        personalityTraitsArray = query.personalityTraits;
      }
      // Loop through each trait in the personalityTraits array:
      personalityTraitsArray.forEach(trait => {
        // Check the trait against each animal in the filteredResults array.
        // Remember, it is initially a copy of the animalsArray,
        // but here we're updating it for each trait in the .forEach() loop.
        // For each trait being targeted by the filter, the filteredResults
        // array will then contain only the entries that contain the trait,
        // so at the end we'll have an array of animals that have every one 
        // of the traits when the .forEach() loop is finished.
        filteredResults = filteredResults.filter(
          animal => animal.personalityTraits.indexOf(trait) !== -1
        );
      });
    }
    if (query.diet) {
      filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
      filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
      filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    // return the filtered results:
    return filteredResults;
  }

app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
      }
    res.json(results);
  });

app.listen(PORT, () => {        //tell it to listen, step 2
    console.log(`API server now on port ${PORT}!`);    //chaining ther listen method onto our server to make our server listen, now run npm start in the terminal
});


/*
Let's start by creating a route that the front-end can request data from. Start by requiring the data by adding the following code to the top of server.js:
const { animals } = require('./data/animals');

The send() method is great if we want to send short messages, but what if we want to send lots of JSON, like we've seen from APIs? To send JSON, just change 
send to json. We do this to change the headers (i.e., additional metadata that's sent with every request/response) so that the client knows it's receiving JSON.
Now update your code to use res.json() by changing the second line in the following code block from res.send('Hello!'); to res.json(animals);:

app.get('/api/animals', (req, res) => {
  res.json(animals);  up above on line 9
});

Let's start by accessing the query property on the req object:

app.get('/api/animals', (req, res) => {
  let results = animals;
  console.log(req.query) added above
  res.json(results);
});

*/






