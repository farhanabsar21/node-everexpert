const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const request = require("request")
const cheerio = require("cheerio")
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://expertlinks:expertlinks@cluster0.ihxuz.mongodb.net/expertlinks?retryWrites=true&w=majority";

let linkData = [];

request("https://webscraper.io/test-sites/e-commerce/allinone", (error, response, html) => {
    if(!error && response.statusCode === 200){
        const $ = cheerio.load(html);
        const getLinks = $("a");
        getLinks.each((i, link) => {
            const href = link.attribs.href;
            // let filtered = href.filter(data => data !== undefined)
            let dataArray = Object.entries(link)
            linkData = [...dataArray]
        })
    }
})

const obj = Object.fromEntries(linkData);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("expertlinks").collection("expertlinks");
  collection.insertOne(obj)
});



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})



