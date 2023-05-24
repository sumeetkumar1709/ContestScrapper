const cheerio = require('cheerio');
const express = require('express');
const axios = require('axios');
const cache = require('node-cache')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const schema=require('./schema')


dotenv.config()

// DataBase Connection To MongoDB
const uri = process.env.MONGO_URI;
mongoose.connect(
  uri, 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});



const codechefcollection = mongoose.model("codechefcontest",schema.CodechefSchema);
const atcodercollection = mongoose.model("atcodercontest",schema.AtcoderSchema);
const leetcodecollection = mongoose.model("leetcodecontest",schema.LeetcodeSchema);

let chrome = {};
let puppeteer;

let mycache = new cache();

/** Helper Functions */


async function getdata(collection){
    const data = await collection.find({});
    return data;
}

function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }

function getDay(){
  var d = new Date();
  return d.getDate();
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
        obj[i]=cur;
    }
    codechefjson=obj;
       
    
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
        obj[t]=cur;
    }
    
    //console.log(obj);
    atcoderjson = obj;
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
  //await delay(2000);
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
    obj[j] = cur;
  }

  leetcodejson=obj;
}



app.use(express.static(__dirname+"/public"));
app.use(express.json());


app.get('/', (req, res)=>{
  res.sendFile(__dirname + "/public/" + "index.html");
});


app.post('/codechef',async(req,res)=>{
  console.log("|---- POST COODECHEF REQUEST ----|");
  data= await getdata(codechefcollection);
  var refresh=null;
  var ack=false;
  console.log(ack)
  if(data.length>0){  
      refresh=data[0].refreshdate;
      var cur = getDay();
      if(cur!=refresh){
        ack=true;
      }
      console.log(ack)
  }
  else{
    ack=true;
  }
  console.log(ack);
  if(ack){
    await codechefcollection.deleteMany({})
    .then((r)=>{console.log("Success Deletion")})
    .catch((err)=>{
        console.log(err)
    })
    await codechef();
    for(var i=0; i<codechefjson.length;i++){
        data = new codechefcollection({
          contestcode:codechefjson[i].contestcode,
          contestname:codechefjson[i].contestname,
          date:codechefjson[i].date,
          time:codechefjson[i].time,
          duration:codechefjson[i].duration,
          refreshdate:getDay(),
        })

        state = await data.save().catch(err =>{
          if(err){
            console.log(`Error in updating db`)
          }
          else{
            console.log(`record updated successfully`);
          }
        })
    }
  }

  if(ack)
  res.send("Success!!!!");
  else
  res.send("Data Already Up To Date In DB!!!!");
})



app.post('/leetcode',async(req,res)=>{
  console.log("|---- POST LEETCODE REQUEST ----|");
  data= await getdata(leetcodecollection);
  var refresh=null;
  var ack=false;
  console.log(ack)
  if(data.length>0){  
      refresh=data[0].refreshdate;
      var cur = getDay();
      if(cur!=refresh){
        ack=true;
      }
      console.log(ack)
  }
  else{
    ack=true;
  }
  console.log(ack);
  if(ack){
    await leetcodecollection.deleteMany({})
    .then((r)=>{console.log("Success Deletion")})
    .catch((err)=>{
        console.log(err)
    })
    await leetcode();
    for(var i=0; i<leetcodejson.length;i++){
        data = new leetcodecollection({
          contestname:leetcodejson[i].contestname,
          time:leetcodejson[i].time,
          refreshdate:getDay(),
        })

        state = await data.save().catch(err =>{
          if(err){
            console.log(`Error in updating db`)
          }
          else{
            console.log(`record updated successfully`);
          }
        })
    }
  }

  if(ack)
  res.send("Success!!!!");
  else
  res.send("Data Already Up To Date In DB!!!!");
})


app.post('/atcoder',async(req,res)=>{
    console.log("|---- POST ATCODER REQUEST ----|");
    data= await getdata(atcodercollection);
    var refresh=null;
    var ack=false;
    console.log(ack)
    if(data.length>0){  
        refresh=data[0].refreshdate;
        var cur = getDay();
        if(cur!=refresh){
          ack=true;
        }
        console.log(ack)
    }
    else{
      ack=true;
    }
    console.log(ack);
    if(ack){
      await atcodercollection.deleteMany({})
      .then((r)=>{console.log("Success Deletion")})
      .catch((err)=>{
          console.log(err)
      })
      await atcoder();
      for(var i=0; i<atcoderjson.length;i++){
          data = new atcodercollection({
            contestname:atcoderjson[i].contestname,
            starttime:atcoderjson[i].starttime,
            duration:atcoderjson[i].duration,
            ratedfor: atcoderjson[i].ratedfor,
            refreshdate:getDay(),
          })

          state = await data.save().catch(err =>{
            if(err){
              console.log(`Error in updating db`)
            }
            else{
              console.log(`record updated successfully`);
            }
          })
      }
    }

    if(ack)
    res.send("Success!!!!");
    else
    res.send("Data Already Up To Date In DB!!!!");
})




app.get('/codechef', async(req, res)=>{
    data= await getdata(codechefcollection);
    obj=[];
    for(var i=0; i<data.length; i++){
      cur=[];
      cur['contestcode']=data[i].contestcode;
      cur['contestname']=data[i].contestname;
      cur['date']=data[i].date;
      cur['time']=data[i].time;
      cur['duration']=data[i].duration;
      obj[`${i}`]={...cur};
    }
    res.send({...obj});
}); 


app.get('/atcoder', async(req, res)=>{
  
  data = await getdata(atcodercollection);
  obj=[];

  for(var i=0;i<data.length;i++){
    cur=[];
    cur['contestname']=data[i].contestname;
    cur['starttime']=data[i].starttime;
    cur['duration']=data[i].duration;
    cur['ratedfor']=data[i].ratedfor;

    obj[`${i}`]={...cur};
  }

  res.send({...obj});
  
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


app.get('/leetcode', async(req, res)=>{
  data = await getdata(leetcodecollection);
  obj=[];

  for(var i=0;i<data.length;i++){
    cur=[];
    cur['contestname']=data[i].contestname;
    cur['time']=data[i].time;
    obj[`${i}`]={...cur};
  }

  res.send({...obj});
  
});

app.listen(process.env.PORT || PORT,()=>{console.log(`listening on port ${PORT}`)});



// vercel --prod --force