const cheerio = require('cheerio');
const express = require('express');
const axios = require('axios');
const cache = require('node-cache')

let chrome = {};
let puppeteer;

let mycache = new cache();

function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }


function secondsUntilEndOfDay(){
  var d = new Date();
  var h = d.getHours();
  var m = d.getMinutes();
  var s = d.getSeconds();
  var secondsUntilEndOfDate = (24*60*60) - (h*60*60) - (m*60) - s;

  return secondsUntilEndOfDate;
}

/**  this condition is necessary for the puppeteer to work on production and development
 *  with different dependencies required */

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  chrome = require("chrome-aws-lambda");
  puppeteer = require("puppeteer-core");
} else {
  puppeteer = require("puppeteer");
}


const app = express();
const PORT = 8000;



let codechefjson;
async function codechef(){

    let options = {};
    const url='https://www.codechef.com/contests?itm_medium=navmenu&itm_campaign=allcontests';
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
        if(i===2){
           table =temp;
        }
        i+=1; 
    });

    $ = cheerio.load(table);
    let ptag=[];
    i=0;
    $('p',table).each(function(){
        ptag[i]=$(this).html();
        i++;
    });

    let span=[]
    i=0
    $('span',table).each(function(){
        span[i]=$(this).html();
        i++;
    })
    //console.log(span);

    // creating the json object for the api to return from the server
    obj = [];
    let j=0;
    for(i=0;i<span.length;i++){
        cur=[]
        cur['contestcode']=ptag[j++];
        cur['contestname']=span[i];
        cur['date']=ptag[j++];
        cur['time']=ptag[j++];
        cur['duration']=ptag[j++];
        j+=2;
        obj[`${i}`]={...cur};
    }
    codechefjson={...obj}
       
    
}

let codeforcesjson={};
async function codeforces(){
    const url = 'https://codeforces.com/api/contest.list?';
     await axios
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



let leetcodejson={};
async function leetcode(){
  let options = {};
  const url='https://leetcode.com/contest/';
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

  let html = bodyHTML;

  $ = cheerio.load(html);
  let i=0;
  let swiper;
  $('.swiper-wrapper',html).each(function(){
    if(i===0){
      swiper=$(this).html(); 
    }
    i++;
  });
  //console.log(swiper);
  let contests=[];
  $ = cheerio.load(swiper);
  i=0;
  $('.px-4 .font-medium span',swiper).each(function(){
    contests[i++]=$(this).html();
  });

  let time=[];
  i=0;
  $('.px-4 .text-label-2',swiper).each(function(){
    time[i++]=$(this).html();
  });

  // console.log(time,contests);

  obj=[];

  for(let j=0;j<contests.length;j++){
    cur=[];
    cur['contestname'] = contests[j];
    cur['time'] = time[j];
    obj[`${j}`] = {...cur};
  }

  leetcodejson={...obj};
}



app.use(express.static(__dirname+"/public"));

app.get('/', (req, res)=>{
    res.sendFile(__dirname + "/public/" + "index.html");
});

app.get('/codechef', async(req, res)=>{
    if(mycache.has('codechef')){
        return res.send(mycache.get('codechef'));
    }
    else{
      await codechef();
      mycache.set('codechef',codechefjson,[secondsUntilEndOfDay()]);
      res.send(codechefjson)
    }
    
}); 


app.get('/codeforces', async(req, res)=>{
    if(mycache.has('codeforces')){
      return res.send(mycache.get('codeforces'));
    }
    else{
      await codeforces();
      mycache.set('codeforces',codeforcesjson,[secondsUntilEndOfDay()]);
      res.send(codeforcesjson);
    }

});

app.get('/atcoder', async(req, res)=>{
    if(mycache.has('atcoder')){
      return res.send(mycache.get('atcoder'));
    }
    else{
      await atcoder();
      mycache.set('atcoder',atcoderjson,[secondsUntilEndOfDay()]);
      res.send(atcoderjson);
    }
    
});

app.get('/leetcode', async(req, res)=>{
  if(mycache.has('leetcode')){
    return res.send(mycache.get('leetcode'));
  }
  else{
    await leetcode();
    mycache.set('leetcode',leetcodejson,[secondsUntilEndOfDay()]);
    res.send(leetcodejson);
  }
  
});

app.listen(process.env.PORT || PORT,()=>{console.log(`listening on port ${PORT}`)});



// vercel --prod --force