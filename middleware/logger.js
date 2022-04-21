//import date-fns, path, uuid, fs, fs.promises modules
//create async logEvent method with 'msg' as argument
//create date and time format
//create uuid generator
//Inside 'logEvent' method, first check 'log' directory is present
//Create 'log' directory if it is not present
//Then append log msg which contains date, uuid and msg to the file 'logs.txt'
//Export 'logEvent' method

const {format} = require('date-fns')
const fs = require('fs')
const fsPromises = require('fs').promises
const {v4: uuid} = require('uuid')
const path = require('path')

const logEvent = async (message,fileName)=>{
    const date = format(new Date(),'dd-MM-yyyy HH:mm:ss')
    const logItem = `\n${date} \t${uuid()}\t${message}`
    console.log(logItem)
    try{
        if(!fs.existsSync(path.join(__dirname,'../log'))){
            await fsPromises.mkdir(path.join(__dirname,'../log'))
        }
        await fsPromises.appendFile(path.join(__dirname,'../log',fileName),logItem)
    }
    catch(err){
        if(err){
            console.log(err)
        }
    }
}

const logger = (req,res,next)=>{
    logEvent(`${req.method}\t${req.headers.origin}\t${req.url}`,'/reqLog.txt');
    next();
}

module.exports = {logger , logEvent};