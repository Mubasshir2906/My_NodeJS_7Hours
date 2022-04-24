const data={
    users: require('./../model/users.json'),
    setUsers: function(data){
        this.users = data;
    }
}

const bcrypt = require('bcrypt')
const fsPromises = require('fs').promises
const path = require('path')

const createNewUser = async (req,res)=>{
    const {user,pwd} = req.body;
    
        if(!user || !pwd) res.status(400).json({'msg':'Username and password both are needed'});

        const duplicate = data.users.find(person => person.username === user)
        if(duplicate) res.status(409).json({'msg':'conflict'})
    
    try{
        const hashedPwd = await bcrypt.hash(pwd,10);
        const newUser = {"username":user,"password":hashedPwd}
        
        data.setUsers([...data.users,newUser])
        await fsPromises.writeFile(path.join(__dirname,'..','model','users.json'),JSON.stringify(data.users))
    }catch(err){
        res.status(500).json({'msg':'err.msg'})
    }
    console.log(data.users)
    res.status(201).json({'msg':'User created successfully'})
}

module.exports = {createNewUser};