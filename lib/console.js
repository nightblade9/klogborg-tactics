// Capture the existing console (if there is one) -- we still log to it
if (typeof console  != "undefined" && typeof console.log != 'undefined') {
  console.oldLog = console.log;
} else {
  console.oldLog = function() {};
}

// Create a div, styled the way we want
window.onload = function() {
  if (window.showConsole != false) {
    var div = document.createElement("div");
    div.id = "console";
    div.style.width = "250px";
    div.style.height = "100%";
    div.style.background = "#ccc";
    div.style.overflowY = "auto";
    div.style.float = "right";

    document.body.appendChild(div);
  }
}

console.debug = function(message) {
  console.oldLog(message);
  log('#00f', message);
};

console.error = function(message) {
  console.oldLog(message);
  log('#f00', message);
}

console.info = function(message) {
  console.oldLog(message);
  log('#888', message);
}

console.log = function(message) {
  console.oldLog(message);
  log('#000', message);
}

function log(color, message) {
  var html = "<span style='color: " + color + ";'>" + message + "</span><br />";
  $dom = document.getElementById("console");
  if ($dom != null) {
    $dom.innerHTML += html;
    scrollToEnd();
  }
}

function scrollToEnd() {
  var elem = document.getElementById('console');
  elem.scrollTop = elem.scrollHeight;
  // scrollTop is always reset to 0
}
