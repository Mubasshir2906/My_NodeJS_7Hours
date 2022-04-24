const data={
    users: require('./../model/users.json'),
    setUsers: function(data){
        this.users = data;
    }
}

const bcrypt = require('bcrypt')

const authUser = async (req,res)=>{
    const {user,pwd} = req.body;
    
        if(!user || !pwd) return res.status(400).json({'msg':'Username and password both are needed'});

        const userFound = data.users.find(person => person.username === user)

        if(!userFound){
            return res.status(401).send({'msg':'un-authorized user'})
        }

        const matchPwd = await bcrypt.compare(pwd, userFound.password)
        if(!matchPwd) return res.status(401).send({'error':'password not matched'})

        res.json({'success':'User logged in'})

}

module.exports = {authUser}