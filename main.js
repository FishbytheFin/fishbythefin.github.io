let seizureMode = document.getElementById("seizureBox").checked;
let body = document.getElementById("body");
let seizureInterval = setInterval(changeColor, 100);

function changeColor() {
  seizureMode = document.getElementById("seizureBox").checked;
  if (seizureMode) {
    body.style.backgroundColor = "rgb(" + (Math.floor(Math.random() * 255) + 1).toString() + ", " + (Math.floor(Math.random() * 255) + 1).toString() + ", " + (Math.floor(Math.random() * 255) + 1).toString() + ")";
  } else {
    body.style.backgroundColor = "#fff";
  }
}