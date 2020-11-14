let net;

async function apptest() {
  console.log('Loading mobilenet..');

  // Load the model.
  net = await mobilenet.load();
  console.log('Successfully loaded model');

  // Make a prediction through the model on our image.
  const imgEl = document.getElementById('img');
  const result = await net.classify(imgEl);
  console.log(result);
}

async function app() {
  console.log('Loading mobilenet..');
  
  const webcamElement = document.querySelector('video');
  
  // Load the model.
  net = await mobilenet.load();
  console.log('Successfully loaded model');
  
  // Create an object from Tensorflow.js data API which could capture image 
  // from the web camera as Tensor.
  const webcam = await tf.data.webcam(webcamElement);
  while (true) {
    const img = await webcam.capture();
    const result = await net.classify(img);

    document.getElementById('console').innerText = `
      prediction: ${result[0].className}\n
      probability: ${result[0].probability}
    `;
    // Dispose the tensor to release the memory.
    img.dispose();

    // Give some breathing room by waiting for the next animation frame to
    // fire.
    await tf.nextFrame();
  }
}

async function listelements() {
  var vids = document.getElementsByTagName('video') 
  // vids is an HTMLCollection
  for( var i = 0; i < vids.length; i++ ){ 
      console.log( vids.item(i).src )
  }
}

listelements();
//app();
