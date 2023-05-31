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

app.get('/', (request, response)=> {
    response.send('Hello world')
})

app.get('/api/department', (request, response)=>{
    var query = `SELECT * from Department`;
    connection.query(query, function(err, rows, fields){
        if(err){
            response.send('Failed');
        }
        response.send(rows);
    })
})