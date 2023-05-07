const cheerio = require('cheerio');
const express = require('express');
const axios = require('axios');
let chrome = {};
let puppeteer;
/**  this condition is necessary for the puppeteer to work on production and development
 *  with different dependencies required */

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  chrome = require("chrome-aws-lambda");
  puppeteer = require("puppeteer-core");
} else {
  puppeteer = require("puppeteer");
}


function delay(time) {
  return new Promise(function(resolve) { 
      setTimeout(resolve, time)
  });
}


const app = express();
const PORT = 3000;

let atcoderjson={};



async function atcoder(){
  let options = {};
  const url='https://atcoder.jp/contests/';
  if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
      options = {
      args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
      };
  }

  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  await page.goto(url);
  await page.setViewport({width: 1080, height: 1024});
  await delay(4000);
  bodyHTML = await page.evaluate(() =>  document.documentElement.outerHTML);
  //console.log(bodyHTML);
  await browser.close();

  let html=bodyHTML;
    $ = cheerio.load(html)
    let i=0;
    let table
    $('table',html).each(function(){
        let temp=$(this).html()
        if(i===1){
           table =temp;
        }
        i+=1; 
    });

    $ = cheerio.load(table);
    let names=[];
    i=0;
    var k=0;
    $('td a',table).each(function(){
        if(i%2===1){
          names[k++]=$(this).html();
        }
        i++;
    });
    //console.log(names);
    
    let times=[];
    i=0;
    $('td a time',table).each(function(){
          times[i++]=$(this).html();
    });
    //console.log(times);

    let td = [];
    i=0;
    $('.text-center',table).each(function(){
      td[i++]=$(this).html();
    });
    
    i
    let temp=1;
    let info=[];
    let j=0;
    for(let i=5; i<td.length; i++){
      if(temp===3){
        temp=1;
      }
      else{
        info[j++]=td[i];
        temp++;
      }
      
    }
    let obj=[];
    i=0;
    for(var t=0; t<names.length;t++){
        let cur=[];
        cur['contestname']=names[t];
        cur['starttime']=times[t];
        cur['duration'] = info[i];
        i++;
        cur['ratedfor']=info[i];
        i++;
        obj[`${t}`]={...cur};
    }
    
    //console.log(obj);
    atcoderjson = {...obj};
    //console.log(atcoderjson);
}




app.get('/', (req, res)=>{
    res.send("Welcome to webscrapping API for coding contests");
});


app.get('/atcoder', async(req, res)=>{
    await atcoder();
    res.send(atcoderjson);
});

app.listen(process.env.PORT || PORT,()=>{console.log(`listening on port ${PORT}`)});