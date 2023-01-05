const express = require('express');
const res = require('express/lib/response');

const serverless = require('serverless-http');

const app = express();

const  router  = express.Router();

//Get 'hello' & Test 2

router.get('/', (req, res) => {
    res.json({
        'hello' : 'hi!'
    });
});

router.get('/test', (req, res) => {
    res.json({
        'hello' : 'test2'
    });
});

//get all movies

router.get('/movies', (req, res) => {
    res.json({
        'here are the' : 'movies'
    });
});

//get movies by title

router.get('/movies/:Title', (req, res) => {
    res.json({
        'here is the' : 'Title'
    });
});

//get genre by name

router.get('/movies/genres/:Name', (req, res) => {
    res.json({
        'here is the' : 'Genre Name'
    });
});

//get director by name

router.get('/movies/directors/:Name', (req, res) => {
    res.json({
        'here is the' : 'Directors Name'
    });
});

//get all users

router.get('/users', (req, res) => {
    res.json({
        'here are' : 'The Users'
    });
});

// add a user

router.post('users', 
[
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.username + " already exists");
        } else {
          Users.create({
            username: req.body.Username,
            password: hashedPassword,
            name: req.body.Name,
            surname: req.body.Surname,
            email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

//allow users to update their info

router.put(
    "/users/:Username",
    // passport.authenticate("jwt", { session: false }),
    [
      check("Username", "Username is required").isLength({ min: 5 }),
      check(
        "Username",
        "Username contains non alphanumeric characters - not allowed."
      ).isAlphanumeric(),
      check("Password", "Password is required").not().isEmpty(),
      check("Email", "Email does not appear to be valid").isEmail(),
    ],
    (req, res) => {
      // check the validation object for errors
      let errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
  
      let hashedPassword = Users.hashPassword(req.body.Password);
      Users.findOneAndUpdate(
        { username: req.params.Username },
        {
          $set: {
            username: req.body.Username,
            password: hashedPassword,
            name: req.body.Name,
            surname: req.body.Surname,
            email: req.body.Email,
            Birthday: req.body.Birthday,
          },
        },
        { new: true }, // This line makes sure that the updated document is returned
        (err, updatedUser) => {
          if (err) {
            console.error(err);
            res.status(500).send("Error: " + err);
          } else {
            res.json(updatedUser);
          }
        }
      );
    }
  );

  // Delete a user by username

  router.delete(
    "/users/:Username",
    // passport.authenticate("jwt", { session: false }),
    (req, res) => {
      Users.findOneAndRemove({ username: req.params.Username })
        .then((user) => {
          if (!user) {
            res.status(400).send(req.params.Username + " was not found");
          } else {
            res.status(200).send(req.params.Username + " was deleted.");
          }
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send("Error: " + err);
        });
    }
  );

  // Adda a movie to a user's list of favorites

  router.post(
    "/users/:Username/movies/:MovieID",
    // passport.authenticate("jwt", { session: false }),
    (req, res) => {
      Users.findOneAndUpdate(
        { username: req.params.Username },
        {
          $push: { favoriteMovies: req.params.MovieID },
        },
        { new: true }, // This line makes sure that the updated document is returned
        (err, updatedUser) => {
          if (err) {
            console.error(err);
            res.status(500).send("Error: " + err);
          } else {
            res.json(updatedUser);
          }
        }
      );
    }
  );

  // Remove a movies to a user's list of favorites

  router.delete(
    "/users/:Username/movies/:MovieID",
    // passport.authenticate("jwt", { session: false }),
    (req, res) => {
      Users.findOneAndUpdate(
        { username: req.params.Username },
        {
          $pull: { favoriteMovies: req.params.MovieID },
        },
        { new: true }, // This line makes sure that the updated document is returned
        (err, updatedUser) => {
          if (err) {
            console.error(err);
            res.status(500).send("Error: " + err);
          } else {
            res.json(updatedUser);
          }
        }
      );
    }
  );

  // error handling middle ware function

  router.use((err, req, next) => {
      console.error(err.stack);
      res.status(500).send('Something is Wrong');
  });


app.use('/.netlify/functions/api',router)


module.exports.handler = serverless(app);