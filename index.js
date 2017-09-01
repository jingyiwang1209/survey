// so far the nodejs only supports commonjs module
const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const key = require('./config/key');


// !!!!the order of the following 2 is important!! If passport is on the top,
// then passport.js will be executed first, in passport.js, the mongoose.model('users') will
// throw an error since it has not been created yet! So we need to create users first, then run passport.js
// *JS won't automatically run the thing in models/User, so it should be manually require here.
require('./models/User');
// We don't need to assign a variable here because passport.js does not return anything, instead
// we just want to execute passport.js, the same thing for models/User
require('./services/passport');

// connect to mlab
mongoose.connect(key.mongoURI);

const app = express();

app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [key.cookieKey]
    })
);

app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
// equals to:
// const authRoutes = require('./routes/authRoutes');
// authRoutes(app);

// if there is an env variable that has been defined by heroku, go ahead
// and sign that variable to PORT, otherwise by default just use the value of 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT);
