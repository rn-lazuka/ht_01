import express from 'express'
import bodyParser from 'body-parser';
import {videoRouter} from './routes/video-router';
import {testRouter} from './routes/test-router';

const app = express();

const port = process.env.PORT || 5000
const parserMiddleware = bodyParser()

app.use(parserMiddleware)
app.use('videos',videoRouter)
app.use('testing/all-data',testRouter)

app.listen(port, ()=>{
    console.log(`App listen on port ${port}`)
})
