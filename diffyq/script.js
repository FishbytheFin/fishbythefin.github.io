const hints = ["fart", "poop", "pee", "peepee", "peepeepoopoo"];

function playAd1() {
  const video = document.createElement('video');
  video.src = 'videos/boots.mov';
  video.controls = false;
  document.body.appendChild(video);
  video.play();
  setTimeout(() => {
    reveal(video, hints[0]);
  }, 30000);
}

function reveal(video, hint) {
  video.pause();
  video.display = 'none';
  const text = document.createElement('div');
  const hintText = document.createTextNode(hint);
  text.appendChild(hintText);
  document.body.appendChild(text);
}