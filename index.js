const PORT = 8000;
const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");

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
    // console.log("Got it, response is:  ", res );
    return res;
  }
};

// getUrls();

const getProviders = async () => {
  const details = await getUrls();

  if (details) {
    details.forEach(function(item, index) {
      // console.log(item)
      try {
        const response = 
          axios.get(item)
          .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            // console.log(html)
            $('.providerSideBlue', html).each(function() {
                    const providerName = $(this).find('h3').text();
                    const providerLocation = $(this).find('p').text();

                    providerInfo.push({
                      providerName,
                      providerLocation
                    });
                  })
                  
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


