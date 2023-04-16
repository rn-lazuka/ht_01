import {app} from './settings';
import {runDB} from './db';

const port = process.env.PORT || 5000

const startApp = async ()=>{
    await runDB()
    app.listen(port, ()=>{
        console.log(`App listen on port ${port}`)
    })
}

startApp();
