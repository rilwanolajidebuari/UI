const express = require('express');
const bodyParser = require('body-parser');
const port = 8000;
const mysql = require('mysql');

const app = express();

const bcrypt = require('bcryptjs');
const saltRounds = 10;

const jwt = require('jsonwebtoken');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));


const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '12345',
  database : 'ridemywaydb'
});

connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    console.log('connected as id ' + connection.threadId);
  });


app.get('/users',verifyToken,function(req,res){

    connection.query('SELECT * from users', function (error, users, fields) {
        if (error) {

            return res.send(400);
        }
        else{
            return res.send({
                users
            })
        }
      });

})

app.post('/auth/signup',verifyToken,function(req,res){
    const{firstName,lastName,userName,email,phoneNumber,password} = req.body
    
    bcrypt.hash(password, saltRounds,function(err,hash) {
    connection.query('insert into users(firstName,lastName,userName,email,phoneNumber,password) values (?,?,?,?,?,?)',[firstName,lastName,userName,email,phoneNumber,hash],
    function (error, users, fields) {
        if (error) {

            return res.status(400).send({error:error.message});
        }
        else{
            return res.send({
                success:true
            })
         }
      });

    });
})


app.put('/users/:id',verifyToken,function(req,res){
    const userId = parseInt(req.params.id)
    
    connection.query(`update users set ? where id =${userId} `,[req.body],
    function (error, users, fields) {
        if (error) {

            return res.status(400).send({error:error.message});
        }
        else{
            return res.send({
                message:"updated successfully"
            })
         }
      });
    
})


app.delete('/users/:id',verifyToken,function(req,res){
    const userId = parseInt(req.params.id)
    
    connection.query(`delete from users  where id =${userId}`,
    function (error, users, fields) {
        if (error) {

            return res.status(400).send({error:error.message});
        }
        else{
            return res.send({
                message:"user deleted successfully"
            })
         }
      });
    
})



app.post('/auth/login', function (req, res) {
    const{firstName,lastName,userName,email,phoneNumber,password} = req.body
    console.log(req.body)
    connection.query(`select * from users WHERE username ="${userName}"`
    , function (error, users, fields) {
        if(error){
            res.status(400).send({success:false,error:error.message})
        }
        console.log(users)
        const user = users[0]
        if(!user){
            res.send({success:false})
        }
     bcrypt.compare(password, user.password,function(err, response) {
        console.log(response)
        if (err){
            res.send({success:false,error:error.message})
        }
        if (response === true){
            jwt.sign({user},'secretKey' ,function(err, token) {
                console.log(token);
                if(err){
                    res.status(400).send({success:false,error:error.message})
                }
                else{
                 res.send({
                    token
                })
            }
        
              })

        }
        
         
    })
    
  })

})


function verifyToken(req,res,next){
const token = req.param.token ||
req.headers['x-access-token'] 
    if (token) {
        jwt.verify(token,'secretKey', (error, decoded) => {
          if (error) {
            res.status(401).send({
              status: 'error',
              message: 'invalid token!'
            });
          } else {
            req.decoded = decoded;
            next();
          }
        });
      } else {
        res.status(401).json({
          status: 'error',
          message: 'Token required for this route'
        });
      }
    }


    app.get('/rides',verifyToken,function(req,res){

        connection.query('SELECT * from rides', function (error, rides, fields) {
            if (error) {
    
                return res.send(400);
            }
            else{
                return res.send({
                    rides
                })
            }
          });
    
    })
    
    app.get('/rides/:rideId',verifyToken,function(req,res){
        const rideId = parseInt(req.params.rideId)
        connection.query(`SELECT * from rides where rideId=${rideId}`, function (error, rides, fields) {
            if (error) {
    
                return res.send(400);
            }
            else{
                return res.send({
                    rides
                })
            }
          });
    
    })
    



    app.post('/users/:id/rides',verifyToken,function(req,res){
        const userId = parseInt(req.params.id)
        const{carName,availableSeats,location,phoneNumber,time,destination} = req.body
        
        connection.query('insert into rides(userId,carName,availableSeats,location,phoneNumber,time,destination) values (?,?,?,?,?,?,?)',[userId,carName,availableSeats,location,phoneNumber,time,destination],
        function (error, users, fields) {
            if (error) {
    
                return res.status(400).send({error:error.message});
            }
            else{
                return res.send({
                    message:"Ride Offer created successfully"
                })
             }
          });
    
        });
    
    
    
    app.put('/users/:id/rides/:rideId',verifyToken,function(req,res){
        const userId = parseInt(req.params.id)
        const rideId = parseInt(req.params.rideId)
        
        connection.query(`update rides set ? where userId =${userId} and rideId =${rideId}`,[req.body],
        function (error, users, fields) {
            if (error) {
    
                return res.status(400).send({error:error.message});
            }
            else{
                return res.send({
                    message:"updated successfully"
                })
             }
          });
        
    })
    
    
    app.delete('/users/:id/rides/:rideId',verifyToken,function(req,res){
        const userId = parseInt(req.params.id)
        const rideId = parseInt(req.params.rideId)
        
        connection.query(`delete from rides  where userId =${userId} and rideId =${rideId}`,
        function (error, users, fields) {
            if (error) {
    
                return res.status(400).send({error:error.message});
            }
            else{
                return res.send({
                    message:"Ride Offer deleted successfully"
                })
             }
          });
        
    })
    
    
    app.get('/users/rides/:rideId/requests',verifyToken,function(req,res){
        const rideId = parseInt(req.params.rideId)
        connection.query(`SELECT * from requests where rideId=${rideId}`, function (error, requests, fields) {
            if (error) {
    
                return res.sendStatus(400);
            }
            else{
                return res.send({
                    requests
                })
            }
          });
    
    })
    



    app.post('/rides/:rideId/requests',verifyToken,function(req,res){
        const rideId = parseInt(req.params.rideId)
        const{passengerName,location,phoneNumber,time,destination} = req.body
        
        connection.query('insert into requests(rideId,passengerName,location,phoneNumber,time,destination) values (?,?,?,?,?,?)',[rideId,passengerName,location,phoneNumber,time,destination],
        function (error, users, fields) {
            if (error) {
    
                return res.status(400).send({error:error.message});
            }
            else{
                return res.send({
                    message:"Request created successfully"
                })
             }
          });
    
        });
    
    
    
    app.put('/users/rides/:rideId/requests/:requestId',verifyToken,function(req,res){
        const rideId = parseInt(req.params.rideId)
        const requestId = parseInt(req.params.requestId)
        
        connection.query(`update requests set ? where rideId =${rideId} and requestId =${requestId}`,[req.body],
        function (error, users, fields) {
            if (error) {
    
                return res.status(400).send({error:error.message});
            }
            else{
                return res.send({
                    message:"updated successfully"
                })
             }
          });
        
    })
    
    app.delete('/rides/:rideId/requests/:requestId',verifyToken,function(req,res){
        const rideId = parseInt(req.params.rideId)
        const requestId = parseInt(req.params.requestId)
        
        connection.query(`delete from requests  where rideId =${rideId} and requestId =${requestId}`,
        function (error, users, fields) {
            if (error) {
    
                return res.status(400).send({error:error.message});
            }
            else{
                return res.send({
                    message:"Request deleted successfully"
                })
             }
          });
        
    })
        
  





app.listen(port);
console.log('server started at http://localhost:'+ port)