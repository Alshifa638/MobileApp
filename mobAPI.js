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
var port=process.env.PORT || 2410;
app.listen(port,()=>console.log(`Listening on port ${port}!`));

let {getConnection}=require("./mobDB.js");


app.get("/mobiles",function(req,res){
    let brand=req.query.brand;
    let RAM=req.query.RAM;
    let ROM=req.query.ROM;
    let OS=req.query.OS;
    let connection=getConnection();
    let options="";
    let optionArr=[];
    if(brand){
        options="WHERE brand=? ";
        optionArr.push(brand);
    }
    if(RAM){
        options=options?`${options} AND  RAM=? ` :" WHERE RAM=?";
        optionArr.push(RAM);
    }
    if(ROM){
        options=options?`${options} AND  ROM=? ` :" WHERE ROM=?";
        optionArr.push(ROM);
    }
    if(OS){
        options=options?`${options} AND  OS=? ` :" WHERE OS=?";
        optionArr.push(OS);
    }
   
   
    let sql=`SELECT * FROM mobiles ${options}`;
    connection.query(sql, optionArr,function(err,result){
        if(err) res.status(404).send(err);
        else  {
          
            res.send(result);
        }
    })
})
app.get("/mobiles/:id",function(req,res){
    let id=+req.params.id;
    let connection=getConnection();;
    let sql="SELECT * FROM mobiles WHERE id=?";
    connection.query(sql,id,function(err,result){
        if(err) res.status(404).send(err);
        else if(result.length===0)  res.status(404).send("No mobiles found");
       
             else res.send(result[0]);
         
      
    })
 });



 
app.post("/mobiles",function(req,res){
    let body=req.body;
    let connection=getConnection();
    let sql="INSERT INTO mobiles(name,price,brand,RAM,ROM,OS) VALUES(?,?,?,?,?,?)";
    connection.query(sql,[body.name,body.price,body.brand,body.RAM,body.ROM,body.OS],function(err,result){
        if(err) res.status(404).send("Error in inserting data");
        else{
            res.send(`Post success.Id of new mobile is ${result.insertId}`);
    }
    })
})

app.put("/mobiles/:id", function(req,res){
    let id=+req.params.id;
    let body=req.body;
    let connection=getConnection();
    let sql="UPDATE mobiles SET name=?,price=?,brand=?,RAM=?,ROM=?,OS=? WHERE id=?";
    let params=[body.name,body.price,body.brand,body.RAM,body.ROM,body.OS,id];
    connection.query(sql,params,function(err,result){
        if(err) res.status(404).send("Error in updating data");
        else if (result.affectedRows===0) res.status(404).send("No  update happened");
         else res.send("Update success")
    })
 })


 app.delete("/mobiles/:id", function(req,res){
    let id=+req.params.id;
    let connection=getConnection();
    let sql="DELETE FROM mobiles WHERE id=?";
   
    connection.query(sql,id,function(err,result){
        if(err) res.status(404).send("Error in deleting data");
        else if (result.affectedRows===0) res.status(404).send("No  delete happened");
         else res.send("delete success")
    })
 })