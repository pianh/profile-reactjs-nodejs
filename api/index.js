var Express = require("express");
var bodyParser = require("body-parser");

var app = Express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

var cors = require('cors')
app.use(cors())

var mysql = require("mysql");
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'',
    database:'mytestdb'
})

app.listen(49146, ()=>{
    connection.connect(function(err){
        if(err) throw err;
        console.log('Connected to DB');
    });
});

var fileUpload = require('express-fileupload');
var fs = require('fs');
const { request } = require("http");
app.use(fileUpload());
app.use('/Photos',Express.static(__dirname+'/Photos'))

app.get('/', (request, response)=> {
    response.send('Hello world')
})

app.get('/api/department',(request, response)=>{
    var query=`SELECT * from Department`;
    connection.query(query, function(err, rows, fields){
        if(err){
            response.send('Failed');
        }
        response.send(rows);
    })
})

app.post('/api/department',(request, response)=>{
    var query=`INSERT into Department
        (DepartmentName)
        VALUE (?)`;
    var values = [
        request.body['DepartmentName']
    ]
    connection.query(query, values, function(err, rows, fields){
        if(err){
            response.send('Failed');
        }
        response.json('Added Successfully');
    })
})


app.put('/api/department',(request, response)=>{
    var query=`UPDATE Department set DepartmentName=? where DepartmentId=?`;
    var values = [
        request.body['DepartmentName'],
        request.body['DepartmentId']
    ];
    connection.query(query, values, function(err, rows, fields){
        if(err){
            response.send('Failed');
        }
        response.json('Updated Successfully');
    })
})

app.delete('/api/department/:id',(request, response)=>{
    var query=`DELETE from Department where DepartmentId=?`;
    var values = [
        parseInt(request.params.id)
    ];
    connection.query(query, values, function(err, rows, fields){
        if(err){
            response.send('Failed');
        }
        response.json('Delete Successfully');
    })
})



app.get('/api/employee',(request, response)=>{
    var query=`SELECT * from Employee`;
    connection.query(query, function(err, rows, fields){
        if(err){
            response.send('Failed');
        }
        response.send(rows);
    })
})

app.post('/api/employee', (request, response) => {
    var query = `INSERT INTO Employee 
    (EmployeeName, Department, DateOfJoining, PhotoFileName) 
    VALUES (?, ?, ?, ?)`;
    var values = [
        request.body['EmployeeName'],
        request.body['Department'],
        request.body['DateOfJoining'],
        request.body['PhotoFileName']
    ];

    connection.query(query, values, function(err, rows, fields) {
        if (err) {
            response.send('Failed');
        } else {
            response.json('Added Successfully');
        }
    });
});



app.put('/api/employee',(request, response)=>{
    var query=`UPDATE Employee set EmployeeName=?, Department=?, DateOfJoining=?, PhotoFileName=?  where EmployeeId=?`;
    var values = [
        request.body['EmployeeName'],
        request.body['Department'],
        request.body['DateOfJoining'],
        request.body['PhotoFileName'],
        request.body['EmployeeId']
    ];
    connection.query(query, values, function(err, rows, fields){
        if(err){
            response.send('Failed');
        }
        response.json('Updated Successfully');
    })
})

app.delete('/api/employee/:id',(request, response)=>{
    var query=`DELETE from Employee where EmployeeId=?`;
    var values = [
        parseInt(request.params.id)
    ];
    connection.query(query, values, function(err, rows, fields){
        if(err){
            response.send('Failed');
        }
        response.json('Delete Successfully');
    })
})

app.post('/api/employee/savefile',(request, response)=>{

    fs.writeFile("./Photos/"+request.files.file.name,
    request.files.file.data, function(err){
        if(err){
            return
            console.log(err);
        }
        response.json(request.files.file.name)
    })
})