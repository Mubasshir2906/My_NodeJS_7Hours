//import EventEmitter module
//import logEvent method locally
//create local emitter and extend EventEmitter
//Create new instance of the local emitter
//Create event listener to the 'log' event, and take msg as arugument in the callbacl function.
//call imported logEvent method in the callback function.
//Emit 'log' event with some message.

const logEvent = require('./middleware/logger')
const EventEmitter = require('events')
const http = require('http')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

class MyEmitter extends EventEmitter{}

const emitter = new MyEmitter()
emitter.on('log',(msg,fileName)=>{
    logEvent(msg,fileName);
})

const PORT = process.env.PORT || 5000;

const serveFile = async (filePath,content_type,response)=>{
    try{
        let data;
        if(filePath.includes('png') || filePath.includes('jpg')){
             data = await fsPromises.readFile(filePath,'') 
        }
        else{
             data = await fsPromises.readFile(filePath,'utf-8')
        }


        if(content_type === 'application/json'){
            data = JSON.parse(data);
            data = JSON.stringify(data)
        }
        
        response.writeHead(200, {'Content-type':content_type});
        response.end(data)
    }
    catch(err){
        console.log(err)
        emitter.emit(`${err.name}\t ${err.message} `,'errorLog.txt')
        response.statusCode = 500;
        response.end()
    }
}

const server = http.createServer((req,res)=>{
    console.log(req.url, req.method)
    const extension = path.extname(req.url)
    //console.log("Extension: ",extension)
    emitter.emit('log',`${req.url}\t ${req.method}`,'reqLog.txt')

    let content_type ;

    switch(extension){
        case '.css': {
            content_type = 'text/css';
            break;
        }
        case '.js':{
            content_type = 'text/javascript';
            break;
        }
        case '.json':{
            content_type = 'application/json';
            break;
        }
        case '.jpg':{
            content_type = 'image/jpeg';
            break;
        }
        case '.png':{
            content_type = 'image/png';
            break;
        }
        case '.txt':{
            content_type = 'text/plain';
            break;
        }
        default: {
            content_type = "text/html"
            break;
        }
    }
    let filePath=
        content_type === 'text/html' && req.url ==='/'
        ? path.join(__dirname,'views','index.html')
        : content_type === 'text/html' && req.url.slice(-1) === '/'
            ? path.join(__dirname,req.url,'index.html')
            : content_type === 'text/html'
                ? path.join(__dirname,'views',req.url)
                : path.join(__dirname,req.url) // to serve css and img files

    console.log("FilePath: ",filePath)            
    if(!extension && req.url.slice(-1)!=='/') filePath += '.html';

    const fileExists = fs.existsSync(filePath)

    if(fileExists){
        //Serve response
        console.log('File Does Exist')
        serveFile(filePath,content_type,res);
    }
    else{
        console.log('File Does Not Exist')
        //Error or Redirect response
        switch(path.parse(filePath).base){
            case 'old.html':{
                res.writeHead(301, { 'Location':'./new-page.html'});
                res.end()
                break;
            }
            case 'www-page.html':{
                res.writeHead(301, { 'Location':'/'})
                res.end()
                break;
            }
            default: serveFile(path.join(__dirname,'views','/404.html'),content_type,res);
        }
    }
});

server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})


// emitter.on('log',(msg)=>{
//     logEvent(msg)
// })

// setTimeout(()=>{
//     emitter.emit('log','Log event emitted')
// },2000)