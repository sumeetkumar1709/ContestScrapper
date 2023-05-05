const cheerio = require('cheerio');
const express = require('express');
const puppeteer=require('puppeteer');
const app = express();
const PORT = 8000;
function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }
const url='https://www.codechef.com/contests?itm_medium=navmenu&itm_campaign=allcontests';

let json={};

async function codechef(){
    const browser = await puppeteer.launch();
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
    json={...obj}
    //console.log(json);
}


codechef();

app.get('/codechef', (req, res)=>{
    res.send(json);
});

app.listen(PORT,()=>{console.log(`listening on port ${PORT}`)});

