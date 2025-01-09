const fs = require('fs');

function readFile(path){
    return fs.readFileSync(path, 'utf8');
}

function tokenizeText(text){
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')  // Replace non-alphanumerics with space
        .split(' ')                    // Split on space
        .filter(Boolean);              // Remove empty strings
}

function loadStopWords(path){
    const stopWordsContent = readFile(path);
    const stopWordsArray = stopWordsContent
        .split(',')
        .map(word => word.trim().toLowerCase());
    const singleLetters = Array.from({length: 26}, (_, i) => String.fromCharCode(97 + i)); // ['a', 'b', ..., 'z']
    const allStopWords = stopWordsArray.concat(singleLetters);
    return new Set(allStopWords);
}

function removeStopWords(words, stopWords){
    return words.filter(word => word && !stopWords.has(word));
}

function countFrequencies(words){
    return words.reduce((counts, word) => {
        counts[word] = (counts[word] || 0) + 1;
        return counts;
    },{});
}

function sortByFrequency(counts){
    return Object.entries(counts).sort((a, b)=>b[1] - a[1]);
}

function printTopWords(sortedWords, n = 25){
    sortedWords.slice(0, n).forEach(([word, count]) => {
        console.log(`${word}  -  ${count}`);
        
    });
}

function termFrequency(pathToFile, stopWordsFile, n){
    const text = readFile(pathToFile);
    const stopWords = loadStopWords(stopWordsFile);
    const words = tokenizeText(text);
    const filteredWords = removeStopWords(words, stopWords);
    const frequenciesMap = countFrequencies(filteredWords);
    const sortedFrequencies = sortByFrequency(frequenciesMap);
    printTopWords(sortedFrequencies, n);
}

const inputFile = process.argv[2];
const stopWordsFile = 'stop_words.txt';
const topN = parseInt(process.argv[3]) || 25; // Default to top 25 words if no argument is provided

termFrequency(inputFile, stopWordsFile, topN);