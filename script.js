var moves = 0, time = 0, timer;

// Put an onclick on every table cell
for (var r = 1; r <= 4; r++) {
  for (var c = 1; c <= 4; c++) {
    document.getElementById("cell" + r + c).onclick = clickTile.bind(null, r, c);
  }
}

function cell(r, c) { return document.getElementById("cell" + r + c); }

function swapTiles(a, b) {
  var temp = a.className, num = a.innerHTML;
  a.className = b.className;
  a.innerHTML = b.innerHTML;
  b.className = temp;
  b.innerHTML = num;
}

// Finds the empty slot next to (r, c); returns its cell or null
function findEmpty(r, c) {
  var near = [[r, c + 1], [r, c - 1], [r + 1, c], [r - 1, c]];
  for (var i = 0; i < 4; i++) {
    var n = near[i];
    if (n[0] >= 1 && n[0] <= 4 && n[1] >= 1 && n[1] <= 4 && cell(n[0], n[1]).className == "tile16") {
      return cell(n[0], n[1]);
    }
  }
  return null;
}

function clickTile(r, c) {
  var empty = findEmpty(r, c);
  if (!empty || cell(r, c).className == "tile16") return;
  swapTiles(cell(r, c), empty);
  moves++;
  document.getElementById("moves").innerHTML = moves;
  setTimeout(Win, 1000);   // delay so the last tile is seen moving before the alert
}

function isSolved() {
  for (var i = 0; i < 16; i++) {
    if (cell(Math.floor(i / 4) + 1, i % 4 + 1).className != "tile" + (i + 1)) return false;
  }
  return true;
}

function Win() {
  if (!isSolved() || !timer) return;
  clearInterval(timer);
  timer = null;
  if (confirm("Congratulations!!\nTime spent on this game: " + time + " seconds\nNumber of moves: " + moves +
              "\nWould you like to play again?")) {
    newGame();
  }
}

function startTimer() {
  moves = 0;
  time = 0;
  document.getElementById("moves").innerHTML = 0;
  document.getElementById("time").innerHTML = 0;
  clearInterval(timer);
  timer = setInterval(function () {
    time++;
    document.getElementById("time").innerHTML = time;
  }, 1000);
}

function solvedBoard() {
  for (var i = 0; i < 16; i++) {
    cell(Math.floor(i / 4) + 1, i % 4 + 1).className = "tile" + (i + 1);
    cell(Math.floor(i / 4) + 1, i % 4 + 1).innerHTML = i < 15 ? i + 1 : "";
  }
}

// Scramble by making random legal moves, so the puzzle can always be solved
function newGame() {
  do {
    solvedBoard();
    var r = 4, c = 4;
    for (var i = 0; i < 200; i++) {
      var d = [[0, 1], [0, -1], [1, 0], [-1, 0]][Math.floor(Math.random() * 4)];
      var nr = r + d[0], nc = c + d[1];
      if (nr >= 1 && nr <= 4 && nc >= 1 && nc <= 4) {
        swapTiles(cell(r, c), cell(nr, nc));
        r = nr;
        c = nc;
      }
    }
  } while (isSolved());
  startTimer();
}

// Only one tile out of place: clicking tile 15 wins
function simpleGame() {
  solvedBoard();
  swapTiles(cell(4, 3), cell(4, 4));
  startTimer();
}

newGame();
