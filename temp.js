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
  $ = cheerio.load(swiper);
  $('.px-4',swiper).each(function(){
    console.log($(this).html());
  });

}


leetcode();


app.get('/', (req, res)=>{
    res.send("Welcome to webscrapping API for coding contests");
});


app.get('/leetcode', async(req, res)=>{
    //await leetcode();
    res.send("Leetcode");
});

app.listen(process.env.PORT || PORT,()=>{console.log(`listening on port ${PORT}`)});