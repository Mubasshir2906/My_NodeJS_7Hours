const data = {
    employees: require('./../model/employees.json'),
    setEmployees: function (data){
        this.employees = data;
    }
}

const getAllEmployees = (req,res)=>{
    res.json(data.employees);
}
const getEmployee = (req,res)=>{
    const employee = data.employees.find(emp => emp.id===parseInt(req.body.id));

    if(!employee){
        return res.status(400).json({'error':'Employee not found'})
    }
    res.status(200).json(employee)

    // res.json({
    //     "id": req.params.id
    // });
}
const createNewEmployee = (req,res)=>{
    const newEmployee = {
        id: data.employees[data.employees.length - 1].id + 1 || 1,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    }
    if(!req.body.firstname || !req.body.lastname){
        return res.status(400).json({"msg": "Both firstname and lastname are required"});
    }

    data.setEmployees([...data.employees,newEmployee]);
    res.status(200).json(data.employees)

    // res.json({
    //     "firstname":req.body.firstname,
    //     "lastname":req.body.lastname
    // });
}

const updateEmployee = (req,res)=>{
    const employee = data.employees.find(emp => emp.id===parseInt(req.body.id));

    if(!employee){
        return res.status(400).json({'error':'Employee not found'})
    }

    if(req.body.firstname) employee.firstname = req.body.firstname;
    if(req.body.lastname) employee.firstname = req.body.lastname;

    const listWithoutUpdaedEmployee = data.employees.filter(emp => emp.id!= parseInt(req.body.id))
    const updatedEmployeeList = [...listWithoutUpdaedEmployee,employee]

    data.setEmployees(updatedEmployeeList.sort((a,b)=> a.id > b.id ? 1 : a.id<b.id ? -1 : 0))
    res.status(200).json(data.employees)
    
    // res.json({
    //     "firstname":req.body.firstname,
    //     "lastname":req.body.lastname
    // });
}
const deleteEmployee = (req,res)=>{
    const employee = data.employees.find(emp => emp.id===parseInt(req.body.id));

    if(!employee){
        return res.status(400).json({'error':'Employee not found'})
    }

    if(req.body.firstname) employee.firstname = req.body.firstname;
    if(req.body.lastname) employee.firstname = req.body.lastname;

    const listWithoutEmployee = data.employees.filter(emp => emp.id!= parseInt(req.body.id))

    data.setEmployees(listWithoutEmployee)
    res.status(200).json(data.employees)
    
    // res.json({
    //     "id": req.body.id
    //     });
}

module.exports = {
    getAllEmployees,
    getEmployee,
    createNewEmployee,
    updateEmployee,
    deleteEmployee
}