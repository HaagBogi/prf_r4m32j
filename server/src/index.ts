
import express from 'express';
import passport from 'passport';
import passportLocal from 'passport-local';
import expressSession from 'express-session';
import { User } from './model/User';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const port = 3000;
const dbUrl = 'mongodb://localhost:5000/my_db'

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(_ => {
    console.log('Successfully connected to MongoDB');
}).catch(error => {
    console.log(error);
})

// const whiteList = ['http://localhost:4200'];
const whiteList = ['*'];
const corsOptions = {
    origin: (origin: any, callback: any) => {
        if (whiteList.indexOf(origin) !== -1 || whiteList.includes('*')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

passport.serializeUser((user: Express.User, done) => {
    console.log('user is serialized');
    done(null, user);
});

passport.deserializeUser((user: Express.User, done) => {
    console.log('user is deserialized');
    done(null, user);
});

passport.use('local', new passportLocal.Strategy((email, password, done) => {
    /* if (email === 'test@test.com' && password === 'testpw') {
        return done(null, new User(email, password));
    } else {
        return done('Incorrect username or password. Please, try it again!');
    } */

    // db query
    User.findOne({ email: email }, (err: any, user: any) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, undefined);
        }
        user.comparePassword(password, (err: any, isMatch: boolean) => {
            if (err) {
                return done(err);
            }
            return done(null, user);
        });
    });
}));

app.use(expressSession({ secret: 'testsecret' }));
app.use(passport.initialize());
app.use(passport.session());


app.use('/app', require('./routes/routes')(passport, express.Router()));

app.listen(port, () => {
    console.log('App is listening on port 3000...');
});

