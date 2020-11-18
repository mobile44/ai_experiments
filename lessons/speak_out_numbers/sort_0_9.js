let recognizer;
let words;
const wordList = ["zero","one","two","three","four","five","six","seven","eight","nine", "yes", "no", "up", "down", "left", "right", "stop", "go"];
const numList = ["zero","one","two","three","four","five","six","seven","eight","nine"];
let modelLoaded = false;
        
document.addEventListener('DOMContentLoaded', () => {
    const wrapperElement = document.getElementById('sp-cmd-wrapper');
    for (let word of wordList) {
        wrapperElement.innerHTML += `<div class='col-3 col-md-6'><div id='word-${word}' class='badge'>${word}</div></div>`;
    };
    
    var table = document.createElement('table');
    var row = table.insertRow(0);
    for(j=0; j<numList.length; j++){
        var text = document.createTextNode(numList[j]);
        var cell = row.insertCell(j);
        var cellid = document.createAttribute("id");
        cellid.value = `${text}-${j}`; 
        cell.setAttributeNode(cellid); 
        cell.appendChild(text);
    }
    document.getElementById("numbers").appendChild(table);
        
    document.getElementById("audio-switch").addEventListener('change', (event) => {
        if(event.target.checked) {
            if(modelLoaded) {
                startListening();
            }else{
                loadModel();
            }
        } else {
            stopListening();
        }   
    });
        
    document.getElementById("audioswitch").addEventListener('change', (event) => {
        if(event.target.checked) {
            if(modelLoaded) {
                startListening();
            }else{
                loadModel();
            }
        } else {
            stopListening();
        }   
    });
});
        
async function loadModel() { 
    // Show the loading element
    const loadingElement = document.getElementById('demo-loading');
    loadingElement.classList.remove('hidden');
            
    // When calling `create()`, you must provide the type of the audio input.
    // - BROWSER_FFT uses the browser's native Fourier transform.
    recognizer = speechCommands.create("BROWSER_FFT");  
    await recognizer.ensureModelLoaded()
            
    words = recognizer.wordLabels();
    console.log("Words: ", words);
    //words = ["_background_noise_", "_unknown_","zero","one","two","three","four","five","six","seven","eight","nine"];
    modelLoaded = true;
            
    // Hide the loading element
    loadingElement.classList.add('hidden');
    startListening();
}
        
function startListening() {
    recognizer.listen(({scores}) => {
            
        // Everytime the model evaluates a result it will return the scores array
        // Based on this data we will build a new array with each word and it's corresponding score
        scores = Array.from(scores).map((s, i) => ({score: s, word: words[i]}));
        console.log("Score:",scores);
                
        // After that we sort the array by scode descending
        scores.sort((s1, s2) => s2.score - s1.score);
        console.log("Score sorted: ",scores);
        
        if (numList.includes(scores[0].word)) {
            // And we highlight the word with the highest score
            const elementId = `word-${scores[0].word}`;
            console.log("Class ID",`word-${scores[0].word}`);
            document.getElementById(elementId).classList.add('active');
                
            // This is just for removing the highlight after 2.5 seconds
            setTimeout(() => {
                document.getElementById(elementId).classList.remove('active');
            }, 2500);
        }
    }, 
    {
        probabilityThreshold: 0.70
    });
}
        
function stopListening(){
    recognizer.stopListening();
}
