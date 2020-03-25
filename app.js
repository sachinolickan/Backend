const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const router = express.Router()
const config = require('./config')
const tokenList = {}
const app = express()
var cors = require('cors')

app.use(cors())

router.get('/', (req,res) => {
    res.send('Ok');
})

router.post('/login', (req,res) => {
    const postData = req.body;
   // console.log(postData.username)
    const user = {
        "username": postData.username,
        "password": postData.password
    }
    // do the database authentication here, with user name and password combination.
    const token = jwt.sign(user, config.secret, { expiresIn: config.tokenLife})
    const refreshToken = jwt.sign(user, config.refreshTokenSecret, { expiresIn: config.refreshTokenLife})
    const response = {
        "status": "Logged in",
        "token": token,
        "refreshToken": refreshToken,
        "timeout":config.tokenLife
    }
    tokenList[refreshToken] = response
    res.status(200).json(response);
})

router.post('/token', (req,res) => {
    // refresh the damn token
    const postData = req.body
    // if refresh token exists
    if((postData.refreshToken) && (postData.refreshToken in tokenList)) {
        const user = {
            "username": postData.username,
            //"password": postData.password
        }
        const token = jwt.sign(user, config.secret, { expiresIn: config.tokenLife})
        const response = {
            "token": token,
            
        }
        // update the token in the list
        tokenList[postData.refreshToken].token = token
        res.status(200).json(response);        
    } else {
        res.status(404).send('Invalid request')
    }
})

router.use(require('./tokenChecker'))

router.get('/secure', (req,res) => {
    // all secured routes goes here
    var data=[
    {"name":"Athira J",
    "employeeID":"CY0212",
    "designation":"Software Engineer",
    "reportingto":"Binu Bhasuran",
    "department":"Development",
    "location":"Kannur"}
];
    res.send({"error":false,"status":"secured","data":data})
})

app.use(bodyParser.json())
app.use('/api', router)
app.listen(config.port || process.env.port || 3000);

//am in new branch


// this change is done in master branch for the second time
//master branch change

// this is done in sachin branch
// this is agin done in sachin branch

