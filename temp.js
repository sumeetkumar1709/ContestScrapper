const cheerio = require('cheerio');
const express = require('express');
const axios = require('axios');




const app = express();
const PORT = 3000;

let codeforcesjson={};
async function codeforces(){
    const url = 'https://codeforces.com/api/contest.list?';
    axios
    .get(url)
    .then(response => {
      //console.log(response.data.result[0].id);
      let temp = response.data.result;
      var k=0;
      for(var i=0;i<temp.length;i++){
        if(temp[i].phase==="BEFORE"){
            codeforcesjson[k++] = temp[i];
        }
      }
    })
    .catch(error => {
      console.log(error);
    });  
}




codeforces();


app.get('/', (req, res)=>{
    res.send("Welcome to webscrapping API for coding contests");
});


app.get('/codeforces', async(req, res)=>{
    res.send(codeforcesjson);
});

app.listen(process.env.PORT || PORT,()=>{console.log(`listening on port ${PORT}`)});