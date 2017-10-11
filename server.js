import "babel-polyfill";
import express from 'express';
import expressGraphQL from 'express-graphql';
import {schema} from '../lib/schema.js';
import { port } from '../reference.json';

const app = express();

app.use('/graphql', expressGraphQL({
	schema:schema,
	graphiql:true
}));

app.listen(port, () => {
	console.log(`Server is running on port ${port}..`);
});
