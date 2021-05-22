const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors');
const bodyParser = require('body-parser')
const request = require("request")
const cheerio = require("cheerio")
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://expertlinks:expertlinks@cluster0.ihxuz.mongodb.net/expertlinks?retryWrites=true&w=majority";
const maxListenersExceededWarning = require('max-listeners-exceeded-warning');
const fs = require("fs")
const writeStream = fs.createWriteStream("links.csv");
const linkData = require("./linkData.json");
maxListenersExceededWarning();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
})

request("https://webscraper.io/test-sites/e-commerce/allinone", (error, response, html) => {
    if(!error && response.statusCode === 200){
        const $ = cheerio.load(html);
        const getLinks = $("a");
        getLinks.each((i, link)=> {
          const href = link.attribs.href;
          // write to csv
          writeStream.write(`${href} \n`);
        }) 
    }
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("expertlinks").collection("expertlinks");
  
  // const filteredArray = linkData.reduce((newData, prevData) => {
  //   if(!newData.find(anyLink => anyLink.link === prevData.link)){
  //     newData.push(prevData)
  //   }
  //   return newData;
  // }) 
  
  // object data filter with Set
  let linkMapToJson = linkData.map(JSON.stringify);
  let storeSet = new Set(linkMapToJson)
  let filteredData = Array.from(storeSet).map(JSON.parse)
  
  // data sent to database
  // filteredData.forEach(item => {
  //   collection.insertOne(item)
  // })

  //getting all the link data from database
  app.get("/everylinkdata", (req, res) =>{
    collection.find()
      .toArray((error, docs) =>{
        res.send(docs)
      })
  })
});



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})



