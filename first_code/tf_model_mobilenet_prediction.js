var width = 320; // We will scale the photo width to this
var height = 0; // This will be computed based on the input stream
var streaming = false;
var video = null;
/*
var canvas = null;
var photo = null;
var startbutton = null;
*/

//const classifier = knnClassifier.create();

function startup() {
    video = document.getElementById('video');
    //canvas = document.getElementById('canvas');
    //photo = document.getElementById('photo');
    //startbutton = document.getElementById('startbutton');

    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
    })
    .then(function(stream) {
        video.srcObject = stream;
        video.play();
    })
    .catch(function(err) {
        console.log("An error occurred: " + err);
    });

    video.addEventListener('canplay', function(ev) {
        if (!streaming) {
            height = video.videoHeight / (video.videoWidth / width);

            if (isNaN(height)) {
                 height = width / (4 / 3);
            }

            video.setAttribute('width', width);
            video.setAttribute('height', height);
            //canvas.setAttribute('width', width);
            //canvas.setAttribute('height', height);
            streaming = true;
         }
    }, false);
    /*
    startbutton.addEventListener('click', function(ev) {
        takepicture();
        ev.preventDefault();
    }, false);

    clearphoto();
    */
}

/*
function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
}
*/
/*
function takepicture() {
    var context = canvas.getContext('2d');
    if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);

        var data = canvas.toDataURL('image/png');
        photo.setAttribute('src', data);
    } else {
        clearphoto();
    }
}
*/

function disablecamera() {
    video.stop();
}

function enablecamera() {
    video.play();
}

async function app() {
  console.log('Loading mobilenet..');

  // Load the model.
  net = await mobilenet.load();
  console.log('Successfully loaded model');
  
  // Create an object from Tensorflow.js data API which could capture image 
  // from the web camera as Tensor.
  const webcam = await tf.data.webcam(video);
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

window.addEventListener('load', startup, false);
app();
