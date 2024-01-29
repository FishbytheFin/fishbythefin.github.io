const hints = ["Hint #1: Teachers wouldn't like you interupting their class.", "Hint #2: You really need a hint for this? Too bad.", "Hint #3: You have the keys, you can find the car buy making it honk."];
const videos = ["videos/54.mp4", "videos/16.mp4", "videos/38.mp4"];
const videoTimes = [54, 16, 38];
const hintDiv = document.getElementById("hint");

function playAd0() {
  
  const text1 = document.createElement('div');
  const adText = document.createTextNode("A short ad will play before recieving the next hint:");
  text1.appendChild(adText);
  hintDiv.appendChild(text1);
  
  const video = document.createElement('video');
  let index = Math.floor(Math.random()*videos.length);
  video.src = videos[index];
  video.controls = false;
  hintDiv.appendChild(video);
  video.play();
  
  setTimeout(() => {
    reveal(video, hints[0]);
  }, (1000*videoTimes[index]));
}

function playAd1() {
  
  const text1 = document.createElement('div');
  const adText = document.createTextNode("A short ad will play before recieving the next hint:");
  text1.appendChild(adText);
  hintDiv.appendChild(text1);
  
  const video = document.createElement('video');
  let index = Math.floor(Math.random()*videos.length);
  video.src = videos[index];
  video.controls = false;
  hintDiv.appendChild(video);
  video.play();
  
  setTimeout(() => {
    reveal(video, hints[1]);
  }, (1000*videoTimes[index]));
}

function playAd2() {
  
  const text1 = document.createElement('div');
  const adText = document.createTextNode("A short ad will play before recieving the next hint:");
  text1.appendChild(adText);
  hintDiv.appendChild(text1);
  
  const video = document.createElement('video');
  let index = Math.floor(Math.random()*videos.length);
  video.src = videos[index];
  video.controls = false;
  hintDiv.appendChild(video);
  video.play();
  
  setTimeout(() => {
    reveal(video, hints[2]);
  }, (1000*videoTimes[index]));
}


function reveal(video, hint) {
  video.pause();
  video.display = 'none';
  video.remove();
  const text = document.createElement('div');
  const hintText = document.createTextNode(hint);
  text.appendChild(hintText);
  hintDiv.appendChild(text);
}
