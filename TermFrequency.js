const fs = require('fs');

function readFile(path){
    return fs.readFileSync(path, 'utf8');
}

function tokenizeText(text){
    return text.toLowerCase().match(/[\w'-]+/g) || [];
    
}

function loadStopWords(path){
    return new Set(fs.readFileSync(path, 'utf8').split(',').map(word => word.trim().toLowerCase()));
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

function termFrequency(pathToFile,stopWordsFile, n){
    const text = readFile(pathToFile);
    const stopWords = loadStopWords(stopWordsFile);

   
    const pipeline = words => 
        sortByFrequency(
            countFrequencies(
                removeStopWords(
                    tokenizeText(words), stopWords
                )
            )
        );

    const result = pipeline(text);
    printTopWords(result, n);
}

const inputFile = process.argv[2];
const stopWordsFile = 'stop_words.txt';
const topN = parseInt(process.argv[3]) || 25; // Default to top 25 words if no argument is provided

termFrequency(inputFile, stopWordsFile, topN);