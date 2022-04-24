const express = require('express')
const path = require('path')
const app = express();
const cors = require('cors')
const corsOptions = require('./config/corsOptoins')
const {logger} = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')

const PORT = process.env.PORT || 3500;

//custom middleware
app.use(logger)

app.use(cors(corsOptions));
//middlewares
app.use(express.urlencoded({extended: false}))

app.use(express.json())

//static pages route
app.use('/',express.static(path.join(__dirname,'/public')));
app.use('/subdir',express.static(path.join(__dirname,'/public')));

//Custom Error Handling with middleware
app.use(errorHandler)

//Routing
app.use('^/',require('./routes/rootRoute'))
app.use('/subdir',require('./routes/subdirRoute'))
app.use('/employees',require('./routes/api/employees'))
app.use('/register',require('./routes/registerRoute'))
app.use('/auth',require('./routes/authRoute'))
app.use('/delete',require('./routes/registerRoute'))

// app.get('/*',(req, res)=>{
//     res.status(404).sendFile(path.join(__dirname,'views','404.html'))
// })

//for all other type of invalid requests
app.all('*',(req,res)=>{
    if(req.accepts('html')){
        res.status(404).sendFile(path.join(__dirname,'views','404.html'))
    }
    else if(req.accepts('json')){
        res.json({ error:'404 NOT FOUND'})
    }
    else {
        res.type('txt').status(404).send("NOT FOUND")
    }
})

app.listen(PORT,()=>{
    console.log(`Server is listening on port ${PORT}`)
})
