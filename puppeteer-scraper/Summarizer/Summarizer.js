const nlp = require('compromise');
const axios = require("axios").default;
// var axios = require("axios").default;

const Summarize1  = (arr, summaryLength = 3) => {
  let text = '';
  for (let i = 0; i < arr.length; i++) {
    text += arr[i] + ' ';
  }
  const doc = nlp(text);
  const sentences = doc.sentences().out('array');
  const summary = sentences.slice(0, summaryLength).join(' ');
  return summary;
}
const Summarize  =  async (arr) => {
  let text1 = '';
  for (let i = 0; i < arr.length; i++) {
    text1 += arr[i] + ' ';
  }
  var summary;
  var options = {
    method: 'POST',
    url: 'https://api.apyhub.com/ai/summarize-text',
    headers: {
      'apy-token': 'APY09iUiJE0m7nRY10Xt7bKoA2f868MOZtAmiwv40Mk4qsA0Az6ezQfi4XEM8AZAlpQHnNVNXL20YR',
      'Content-Type': 'application/json'
    },
    data: {
      text: text1
    }
  };
  
  axios.request(options).then(function (response) {
    console.log(response.data);
    summary = response.data.summary
  }).catch(function (error) {
    console.error(error);
  });
  
  return summary;
}


module.exports = {Summarize, Summarize1};