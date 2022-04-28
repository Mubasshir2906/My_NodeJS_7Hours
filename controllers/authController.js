const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const fsPromises = require('fs').promises
const path = require('path')
require('dotenv').config();

const data={
    users: require('./../model/users.json'),
    setUsers: function(data){
        this.users = data;
    }
}


const authUser = async (req,res)=>{
    const {user,pwd} = req.body;
    
        if(!user || !pwd) return res.status(400).json({'msg':'Username and password both are needed'});

        const userFound = data.users.find(person => person.username === user)

        if(!userFound){
            return res.status(401).send({'msg':'un-authorized user'})
        }

        const matchPwd = await bcrypt.compare(pwd, userFound.password)
        if(matchPwd){
            res.json({'success':'User logged in'})
            const accessToken = jwt.sign(
                {'username':userFound.username},
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn:'30s'}
            );
            const refreshToken = jwt.sign(
                {'username':userFound.username},
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn:'30s'}
            );

            const otherUsers = data.users.filter(person => person.username!== userFound.username);
            const currentUser = {...userFound,refreshToken}
            data.setUsers([...otherUsers,currentUser])
            await fsPromises.writeFile(path.join(__dirname,'..','model','users.json'), JSON.stringify(data.users));

            res.cookies('jwt',refreshToken,{ httpOnly:true, maxAge: 24 * 60 * 60 * 1000})
            res.json(accessToken)
            

        }
        
        else return res.status(401).send({'error':'password not matched'})

        

}

module.exports = {authUser}