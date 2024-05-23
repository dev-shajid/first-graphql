const passport = require('passport')
const bcrypt = require('bcryptjs')

const User = require('../models/user.model')
const { GraphQLLocalStrategy } = require('graphql-passport')

module.exports = async () => {
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id)
            .then((user) => {
                done(null, user)
            })
            .catch((error) => done(error, null))
    })

    passport.use(
        new GraphQLLocalStrategy(async (username, password, done) => {
            try {
                const user = await User.findOne({ username });
                if (!user) {
                    throw new Error("Invalid username or password");
                }
                const validPassword = bcrypt.compare(password, user.password);

                if (!validPassword) {
                    throw new Error("Invalid username or password");
                }

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        })
    );
}