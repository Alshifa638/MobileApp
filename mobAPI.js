let express=require("express");
let app=express();
app.use(express.json());
app.use(function (req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Orihgin, X-Requested-With, Content-Type, Accept"

    );
    next();
});
const port=2410;
app.listen(port,()=>console.log(`Listening on port ${port}!`));

const {Client}=require("pg");
const client=new Client({
    user : "postgres",
    password : "Sameem@1231231",
    database : "postgres",
    port:5432,
    host : "db.zywuwndohtsfwqsbcpvk.supabase.co",
    ssl:{ rejectUnauthorized: false},
});
 client.connect(function(res, error){
        console.log(`Connected!!!`);
    });

app.get("/mobiles1",function (req,res,next){
    console.log("Inside /mobiles1 get api");
  let brand=req.query.brand;
  let ram=req.query.ram;
  let rom=req.query.rom;
  let os=req.query.os
    let options=``;
    let optionArr=[];
    if(brand){
        options=`WHERE brand=\'${brand}\'`;
        optionArr.push(`\'${brand}\'`);
        
    }
    if(ram){
        options=options?`${options} AND  ram=\'${ram}\'` :` WHERE ram=\'${ram}\'`;
        optionArr.push(`\'${ram}\'`);
        
    }
    if(rom){
        options=options?`${options} AND  rom=\'${rom}\'` :` WHERE rom=\'${rom}\'`;
        optionArr.push(`\'${rom}\'`);
      
    }
    if(os){
        options=options?`${options} AND  os=\'${os}\'` :`WHERE os=\'${os}\'`;
        optionArr.push(`\'${os}\'`);
       
    }
   
    //let query=`SELECT * FROM mobiles1`;
   let query=`SELECT * FROM mobiles1 ${options}`;
    client.query(query,optionArr,function(err,result){
     
       client.query(query,function(err,result){
        if(err) {
            console.log(err)
            res.status(404).send(err);}
        else{
            console.log(result)
        res.send(result.rows);}
        // client.end();
    });
});
});

/*app.get("/mobiles1",function(req,res,next){
  console.log("Inside /mobile1 get api");
    let sql="SELECT * FROM mobiles1";
    client.query(sql,function(err,result){
        if(err) {
            console.log(err)
            res.status(404).send(err);}
        else{
            console.log(result)
        res.send(result.rows);}
         client.end();
         
      
    });
 });*/
app.get("/mobile1/:id",function(req,res,next){
    let id=req.params.id;
   
    let sql=`SELECT * FROM mobiles1 WHERE id=${id}`;
    client.query(sql,function(err,result){
        if(err)
        { res.status(404).send(err);}
       
       
             else
             { 
                res.send(result.rows);
               } //client.end();
    })
 });
app.post("/mobiles1", function(req,res, next){
    console.log("Inside post of mobiles1");
   var values=Object.values(req.body);
  console.log(values);
   
    const query=`INSERT INTO mobiles1 (name,price,brand,ram,rom,os) VALUES ($1,$2,$3,$4,$5,$6)`;
   
    client.query(query,values, function(err,result){
        if(err) {  res.status(404).send(err);
            console.log("query",err)
    } 
        else{
            res.send(`posted row  ${result.rowCount}`);
            
          
        }
    })
})

app.put("/mobile1/:id", function(req,res,next){
    let id=req.params.id;
    let name=req.body.name;
    let price=req.body.price;
    let brand=req.body.brand;
   let ram=req.body.ram;
    let rom=req.body.rom;
    let os=req.body.os;
   console.log("body",name)
   
    
    const sql=`UPDATE mobiles1 SET name=$1,price=$2,brand=$3,ram=$4,rom=$5,os=$6 WHERE id=$7`;
    let values=[name,price,brand,ram,rom,os,id]
   // let params=[body.name,body.price,body.brand,body.ram,body.rom,body.os,id];
    client.query(sql,values,
        function(err,result) {
        if(err){ res.status(404).send(err);}
        
         else{ res.send( `${result.rowCount} Update success` )}
        
    })
 })


 app.delete("/mobile1/:id", function(req,res){
    let id=req.params.id;
    let sql=`DELETE FROM mobiles1 WHERE id=${id}`;
   
    client.query(sql,function(err,result){
        if(err) {res.status(404).send("Error in deleting data");}
       
         else {res.send("delete success")}
    })
 })