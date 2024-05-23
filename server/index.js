const express = require('express');
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
require('dotenv').config();
const cors = require('cors');
const passport = require('passport');
const connectMongo = require('connect-mongodb-session');
const { buildContext } = require('graphql-passport');
const session = require('express-session');
const connectDB = require('./db/connectDB');
const http = require("http");
const { ApolloServerPluginDrainHttpServer } = require("@apollo/server/plugin/drainHttpServer");
const passportConfig = require('./passport/passport.config');
const port = 4000;

async function startServer() {
    try {
        await connectDB();

        const app = express();
        const httpServer = http.createServer(app);

        // Passport.js Start
        await passportConfig();
        const MongoDBStore = connectMongo(session);
        const store = new MongoDBStore({
            uri: process.env.MONGO_URI,
            collection: "sessions",
        });

        store.on("error", (err) => console.log("Shajid-Error: ", err));

        app.use(
            session({
                secret: process.env.SECRET,
                resave: false,
                saveUninitialized: false,
                cookie: {
                    maxAge: 1000 * 60 * 60 * 24 * 7,
                    httpOnly: true,
                },
                store: store,
            })
        );

        app.use(passport.initialize());
        app.use(passport.session());
        // Passport.js End

        const server = new ApolloServer({
            typeDefs,
            resolvers,
            plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
        });

        await server.start();

        app.use(
            "/graphql",
            cors({
                origin: "http://localhost:3000",
                credentials: true,
            }),
            express.json(),
            expressMiddleware(server, {
                context: async ({ req, res }) => buildContext({ req, res }),
            })
        );

        // Uncomment and configure this for serving the frontend if needed
        // app.use(express.static(path.join(__dirname, "frontend/dist")));
        // app.get("*", (req, res) => {
        //     if (process.env.NODE === 'production') res.sendFile(path.join(__dirname, "frontend/dist", "index.html"));
        // });

        await new Promise((resolve) => httpServer.listen({ port }, resolve));

        console.log(`🚀 Server is listening at http://localhost:${port}`);
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
}

startServer();
