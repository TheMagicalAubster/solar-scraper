const PORT = 8000;
const axios = require("axios");
const cheerio = require("cheerio");
const { html } = require("cheerio/lib/api/manipulation");
const express = require("express");
const util = require('util')

const app = express();

const url = 'https://solaralberta.ca/go-solar/find-solar-services/';

const providers = [];
const providerInfo = [];
const providerDetails = async() => {
  try {
    const response = await 
      axios.get(url)
      .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        $('.providerContent', html).each(function() {
                const providerUrl = $(this).find('a').attr('href');
                providers.push(providerUrl);
              })
      })
      
    return providers;
  } catch(err) {
    console.log('err')
  }
}

const getUrls = async () => {
  const res = await providerDetails();
  if (res) {
    return res;
  }
};

const getProviders = async () => {
  const details = await getUrls();

  if (details) {
    details.forEach(function(item, index) {
      try {
        const response = 
          axios.get(item)
          .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            $('.providerSideBlue', html).each(function() {
                const providerName = $(this).find('h3').text();
                const providerPhone = $(this).find('a').attr('href')

                providerInfo.push({
                  providerName,
                  providerPhone
                });
              })
              // console.log(util.inspect(providerInfo, {showHidden: true, depth: null}));
              console.log("------------ START ----------------------");
              console.log(JSON.stringify(providerInfo, null, 2));
              
              console.log("------------ END ----------------------");
            })
        return providerInfo;
        } catch(err) {
          console.log(err)
      }
    })
  
  }
    
  
}

getProviders();


app.listen(PORT, () => console.log(`server running on PORT ${PORT}`) );


