const express = require("express"); //Remember to always use require when adding npm packages, and express is a npm package
const fs = require('fs');   //used to write data to our 

// So we've seen and used the fs library before, but what's this new one called path? 
// This is another module built into the Node.js API that provides utilities for working 
// with file and directory paths. It ultimately makes working with our file system a little 
// more predictable, especially when we work with production environments such as Heroku.
const path = require('path');
const {animals} = require("./data/animals");

const PORT = process.env.PORT || 3001;

//2 step process to set up the server, instantiate the server, then tell it to listen for requests
const app = express();  //Instantiate the server, step 1

//The next few lines (MIDDLEWARE FUNCTIONS) are ALWAYS needed every time you create a server that's looking to accept POST data
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

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

  const findById = (id, animalsArray) => {
      const result = animalsArray.filter(animal => animal.id === id)[0];
      return result;
  }

  
//   Here, we're using the fs.writeFileSync() method, which is the synchronous version of fs.writeFile() 
//   and doesn't require a callback function. If we were writing to a much larger data set, the asynchronous 
//   version would be better. But because this isn't a large file, it will work for our needs. We want to write 
//   to our animals.json file in the data subdirectory, so we use the method path.join() to join the value of __dirname, 
//   which represents the directory of the file we execute the code in, with the path to the animals.json file.

//   Next, we need to save the JavaScript array data as JSON, so we use JSON.stringify() to convert it. The other two arguments 
//   used in the method, null and 2, are means of keeping our data formatted. The null argument means we don't want to edit any 
//   of our existing data; if we did, we could pass something in there. The 2 indicates we want to create white space between our 
//   values to make it more readable. If we were to leave those two arguments out, the entire animals.json file would work, but it 
//   would be really hard to read.

function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);
    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        JSON.stringify({ animals: animalsArray }, null, 2)
    );
    //console.log(__dirname);
    return animal;
}

// Let's add our own validation function to server.js to make sure everything is okay. It is going to take our new 
// animal data from req.body and check if each key not only exists, but that it is also the right type of data. Add 
// the following validateAnimal() function to server.js:
function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
      return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
      return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
      return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
      return false;
    }
    return true;
}

  

app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
      }
    res.json(results);
  });

app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    }
    else {
        res.send(404);
    }
});      

app.post('/api/animals', (req, res) => {
    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();
  
    // if any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
      res.status(400).send('The animal is not properly formatted.');
    } else {
      const animal = createNewAnimal(req.body, animals);
      res.json(animal);
    }
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






