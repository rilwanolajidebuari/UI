const express = require('express');
const bodyParser = require('body-parser');
const port =  7000;

let rides = [];
const app = express();

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 


app.get('/api/v1/rides',function(req,res){
    res.send({
        rides
    })
})


app.post('/api/v1/rides',function(req,res){
   const{carName,availableSeats,pickUpLocation,time,destination}= req.body;
   const newRideOffer = {
        id:rides.length + 1,
        carName,
        availableSeats,
        pickUpLocation,
        time,
        destination,
        requests:[]
   }

   rides.push(newRideOffer)
   
   
    res.send({
        success:true,
        rideId:newRideOffer.id
    })
})

app.put('/api/v1/rides/:rideId',function(req,res){
    const rideId = parseInt(req.params.rideId)
    const keystoedit = Object.keys(req.body)
    

    rides.forEach((ride)=>{
        if(ride.id === rideId){
            console.log(rides)

            keystoedit.map((key)=>{
                ride[key] = req.body[key]
            })

            return res.send({
                success:true
            })

        }

    })
    
 })
 


 app.delete('/api/v1/rides/:rideId',function(req,res){
    const rideId = parseInt(req.params.rideId)
   rides = rides.filter((ride)=>ride.id !== rideId)

            return res.send({
                message:"deleted successfully"
            })        
    })
    

 app.get('/api/v1/rides/:rideId/requests',function(req,res){
        const rideId = parseInt(req.params.rideId)
        
        rides.forEach((ride)=>{
            if(ride.id === rideId){
                
                return res.send({
                   requests:ride.requests,
                   sucess:true
                }) 
            }
        })
           
        })


 app.post('/api/v1/rides/:rideId/requests',function(req,res){
    const rideId = parseInt(req.params.rideId)
    const{passengerName,pickUpLocation,phoneNumber,destination} = req.body
    
    rides.forEach((ride)=>{
        if(ride.id === rideId){
            const newRequest = {
                id:ride.requests.length + 1,
                passengerName,
                pickUpLocation,
                phoneNumber,
                destination
            }
            
            ride.requests.push(newRequest)

            return res.send({
               requestId:newRequest.id,
               success:true
            })
            
        }
    })
       
    })

 app.put('/api/v1/rides/:rideId/requests/:requestId',function(req,res){
        const rideId = parseInt(req.params.rideId)
        const requestId = parseInt(req.params.requestId)
        const keysToEdit = Object.keys(req.body)
       
        
        rides.forEach((ride)=>{
            if(ride.id === rideId){
                ride.requests.forEach((request)=>{
                    if(request.id === requestId){
                         

                        keysToEdit.map((key)=>{
                            request[key]=req.body[key]
                        })
                        

                        return res.send({
                            success:true
                         })
                    }
                    
                })
                
            }
        })
           
    })
    
      
 app.delete('/api/v1/rides/:rideId/requests/:requestId',function(req,res){
        const rideId = parseInt(req.params.rideId)
        const requestId = parseInt(req.params.requestId)
        
       
        
       rides = rides.map((ride)=>{
            if(ride.id === rideId){
            requests = ride.requests.filter((request)=>request.id !== requestId)
            ride.requests = requests
            }
             return ride
            })
            return res.send({
                success:true
             })
        })
           
    




app.listen(port);
console.log('Server started! At http://localhost:' + port);
