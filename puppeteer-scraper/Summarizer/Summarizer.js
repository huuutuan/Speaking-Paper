const nlp = require('compromise');

const Summarize  = (arr, summaryLength = 3) => {
  let text = '';
  for (let i = 0; i < arr.length; i++) {
    text += arr[i] + ' ';
  }
  const doc = nlp(text);
  const sentences = doc.sentences().out('array');
  const summary = sentences.slice(0, summaryLength).join(' ');
  return summary;
}

module.exports = Summarize;