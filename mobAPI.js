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
const port = process.env.PORT || 2410
app.listen(port,()=>console.log(`Listening on port ${port}!`));

const {Client}=require("pg");
const client=new Client({
    user : "postgres",
    password : "Sameem@1231231",
    database : "postgres",
    port:5432,
    host : "db.ggajsarcsusyzmkuxqvf.supabase.co",
    ssl:{ rejectUnauthorized: false},
});
 client.connect(function(res, error){
        console.log(`Connected!!!`);
    });

app.get("/mobiles1",function (req,res,next){
    console.log("Inside /mobiles1 get api");
    let brand=req.query.brand;
    let RAM=req.query.RAM;
    let ROM=req.query.ROM;
    let OS=req.query.OS;
    
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
   
   
    let sql=`SELECT * FROM mobiles1 ${options}`;
    client.query(sql,optionArr,function(err,result){
        console.log("query",sql)
        console.log("result",client)
        if(err) {
            res.status(404).send(err);
         
        }

        else  {
          
            
            res.send(result.rows);
            client.end();
           
        }
    })
})
app.get("/mobiles1/:id",function(req,res){
    let id=+req.params.id;
   
    let sql="SELECT * FROM mobiles1 WHERE id=?";
    client.query(sql,id,function(err,result){
        if(err) res.status(404).send(err);
        else if(result.length===0)  res.status(404).send("No mobiles found");
       
             else res.send(result[0]);
         
      
    })
 });
app.post("/mobiles1",function(req,res,next){
    console.log("Inside post of mobiles1");
    var values=Object.values(req.body);
    console.log(values);
   
    let query=`INSERT INTO mobiles1(name,price,brand,RAM,ROM,OS) VALUES($1,$2,$3,$4,$5,$6)`;
   
    client.query(query,values,function(err,result){
        if(err) {  res.status(404).send(err);
            console.log("query",result)
    } 
        else{
            res.send(`Post success.Id of new mobile is ${result.insertId}`)
            console.log("query",result)
          
        }
    })
})
/*
app.post("/mobiles",function(req,res,next){
    //console.log("Inside post of user");
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
*/
app.put("/mobiles1/:id", function(req,res){
    let id=+req.params.id;
    let body=req.body;
    
    let sql="UPDATE mobiles1 SET name=?,price=?,brand=?,RAM=?,ROM=?,OS=? WHERE id=?";
    let params=[body.name,body.price,body.brand,body.RAM,body.ROM,body.OS,id];
    client.query(sql,params,function(err,result){
        if(err) res.status(404).send("Error in updating data");
        else if (result.affectedRows===0) res.status(404).send("No  update happened");
         else res.send("Update success")
    })
 })


 app.delete("/mobiles1/:id", function(req,res){
    let id=+req.params.id;
    let sql="DELETE FROM mobiles1 WHERE id=?";
   
    client.query(sql,id,function(err,result){
        if(err) res.status(404).send("Error in deleting data");
        else if (result.affectedRows===0) res.status(404).send("No  delete happened");
         else res.send("delete success")
    })
 })