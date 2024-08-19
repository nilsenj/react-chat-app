const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./backend/graphql/schema');
const { protect } = require('./backend/middlewares/authMiddleware');

dotenv.config();

const app = express();

app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch(err => {
        console.error(err);
    });

app.use(cors({
    origin: 'http://localhost:' + process.env.PORT
}));

app.use(protect);
// Apply the JWT protection middleware only to GraphQL endpoint
app.use('/graphql', graphqlHTTP((req, res) => ({
    schema: schema,
    graphiql: true,
    context: { req, res } // Pass req and res to the context
})));

const PORT = process.env.SERVER_PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
