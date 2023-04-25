require("dotenv").config({path:__dirname+"/.env"});
const mongoose=require("mongoose");
const morgan=require("morgan")
const helmet=require("helmet")
const cors=require("cors");
const express=require("express");
const authJwt = require("./util/jwt");
const errorHandler=require("./middleware/errorHandlerMw")
const app=express();

//test---------------
// const { MongoClient } = require("mongodb");

// // Replace the following with your Atlas connection string
// const url = "mongodb+srv://admin:5eDunuda0guvOPST@cluster0.w82mk22.mongodb.net/clincky?retryWrites=true&w=majority";
// const client = new MongoClient(url);

// async function run() {
//     try {
//         await client.connect();
//         console.log("Connected correctly to server");

//     } catch (err) {
//         console.log(err.stack);
//     }
//     finally {
//         await client.close();
//     }
// }
// run().catch(console.dir);
//-------------------


process.on("uncaughtException",(exception)=>{console.log("uncaught Exception"+exception);});
process.on("unhandledRejection",(exception)=>{console.log("uncaught async Exception"+exception);});

mongoose.connect(process.env.ATLAS_CONNECTION_STRING,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    dbName:"clinicky"
}).then(()=>{
    console.log('Connected to db');
}).catch((err) => console.log("error occured"+err));


//moddleware
// app.use(helmet.contentSecurityPolicy({

// }));
// app.use((req, res, next) => {
//     res.setHeader('Content-Security-Policy', "default-src 'self'");
//     next();
// });
//middlewares
app.use(cors());
app.options("*",cors);
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(morgan("tiny"))
app.use(authJwt())
app.use(errorHandler)

//routes
const userRouter=require("./routes/user")
const authRouter=require("./routes/auth")
const searchRouter=require("./routes/search")
const profileRouter=require("./routes/profile")
// const mainPageRouter=require("./routes/mainpage")
const appointmentRouter=require("./routes/appointment")
const clinickRouter=require("./routes/clinick")

app.use("/api/user/signup",userRouter);//test done
app.use("/api/user",authRouter);//test done
app.use("/api/search",searchRouter);//test done
app.use("/api/profile",profileRouter);//test done
// app.use("/api/mainPage",mainPageRouter);
app.use("/api/appointments",appointmentRouter);
app.use("/api/clinicks",clinickRouter);//test done

const port=process.env.PORT||4000;
app.listen(port,()=>{
    console.log(`listening ....!!! on port:${port}`)
});

/*TODO:
1- secure the api using the express jwt package and the jwt helper module
2- patient id in the clinic recored must be checked to be a patient or a doctoer
*/
