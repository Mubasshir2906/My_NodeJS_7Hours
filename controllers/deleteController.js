const data = {
    users : require('./../model/users.json'),
    setUsers: (data)=>{
        this.users = data;
    }
}

const express = require('express')
const path = require('path')
const fsPromises = require('fs').promises


const deleteUser = async (req,res)=>{
    const username = req.body.user;

    if(!username) return res.status(400).json({ 'message': 'Usernot found.' });

    const usersAfterDelete = data.users.filter(person => person.user === username)
    try{
        data.setUsers(usersAfterDelete)
        await fsPromises.writeFile(path.join(__dirname,'..','model','users.json'),JSON.stringify(data.users))
    }catch(err){
        res.status(500).json({'msg':'Something gone wrong'})
    }

    res.status(200).json({'msg':'User deleted successfully'})

}

module.exports = {deleteUser};