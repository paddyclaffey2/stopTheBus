const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const bodyParser = require("body-parser");
const cors = require('cors');
const io = require('socket.io')(httpServer, {
  cors: true,
  origins: ['*']
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const maxUsers = 13;
let adminUser = null;
let usersConnected = new Map();
let results = new Map();

let globalCatergoies = [];
let usersWhoSubmittedScore = [];
let roundNumber = 0;

let scores = {};

app.get('/', (req, res) => {
  res.json({
      message: 'Hello World'
  });
});

app.get('/usersConnected', (req, res) => {
  res.json([ ...usersConnected.keys() ]);
});

app.get('/admin', (req, res) => {
  res.json(adminUser);
});

app.post('/register', (req, res) => {
  var user_name = req.body.userName;
  console.log(usersConnected.get(user_name))
  if (usersConnected.get(user_name)) {
    res.status(405)
    res.json({
      error: 'User name already taken, please choose another.'
    });
  } else if ([ ...usersConnected.keys() ].length > maxUsers) {
    res.status(405)
    res.json({
      error: 'max users met'
    });
  } else {
    usersConnected.set(user_name, 'PLACEHOLDER');
    res.end();
  }
});


io.on('connection', (socket) => {

  console.log()

  usersChanged = () => {
    console.log('users-changed ', [ ...usersConnected.keys() ])
    socket.broadcast.emit('users-changed', [ ...usersConnected.keys() ]);
  }

  adminChange = (newAdmin) => {
    console.log('current admin: ' + adminUser + ', new admin: ' + newAdmin)
    adminUser = newAdmin;
    socket.broadcast.emit('admin-changed', newAdmin);
    socket.emit('admin-changed', newAdmin);
  }

  categoriesChange = (categories) => {
    console.log('categories, ', categories)
    globalCatergoies = categories;
    socket.broadcast.emit('categories-ready', globalCatergoies);
    socket.emit('categories-ready', globalCatergoies);
    initGame();
    updateCategoryInPlay();
  }

  updateCategoryInPlay = () => {
    if (globalCatergoies[roundNumber]) {
      socket.emit('category-in-play', globalCatergoies[roundNumber]);
      roundNumber++;
    }
  }

  forceDisconnect = (message) => {
    socket.emit('force-disconnect', message);
  }

  socket.on('disconnect', (session) => {
    let userKey = getByValue(usersConnected, socket.id)
    usersConnected.delete(userKey)
    usersChanged();
    if (adminUser === userKey) {
      adminChange(null);
    } 
  });

  socket.on('send-name', (data) => {
    const userName =  data.userName;
    
    if (usersConnected.get(userName) === 'PLACEHOLDER') {
      usersConnected.set(userName, socket.id);
      socket.emit('confirm-name', true);
      usersChanged();
    } else {
      forceDisconnect('error, username -> map duplicate')
    }
  });

  socket.on('set-admin', (data) => {
    const newAdmin =  data.userName;
    if (!adminUser) {
      adminChange(newAdmin);
    } else {
      socket.emit('invald', 'admin already exists: ' + adminUser);
    }
  });

  socket.on('set-categories', (data) => {
    const categories =  data.categories;
    categoriesChange(categories);
  });

  socket.on('start-game', (data) => {
    const users = [ ...usersConnected.keys() ];
    results = new Map();
    roundNumber = 0;
    users.forEach(user => {
      results.set(user, new Map())
    });
    this.scores = {};
    socket.broadcast.emit('game-ready');
    socket.emit('game-ready');
  });

  socket.on('start-round', (data) => {
    nextRound();
  });

  nextRound= () => {
    var letterToBePlayed = getRandomLetter();
    console.log("next round", letterToBePlayed)
    socket.broadcast.emit('begin-guessing', letterToBePlayed);
    socket.emit('begin-guessing', letterToBePlayed);
    console.log('begin-guessing')
  }

  socket.on('next-round', (data) => {
    nextRound()
  });
  
  // interface ISubmittedAnswers {
  //   catergoryName: string,
  //   answer: string,
  //   score: number,
  // }
  collectScores = (userName, answers, letterInPlay) => {
    const usersSavedScoreMap = results.get(userName);
    usersSavedScoreMap.set(letterInPlay, answers)

    isAllAnswersCollectedForRound(letterInPlay);
  }

  isAllAnswersCollectedForRound = (letterInPlay) => {
    const users = [ ...usersConnected.keys() ];
    let isAllScoresRecieved = true;
    const resultObj = {};

    users.forEach(user => {
      const usersSavedScoreMap = results.get(user);
      resultObj[user] = {};
      if (!usersSavedScoreMap) {
        isAllScoresRecieved = false;
        return;
      }

      const letterSavedScoreMap = usersSavedScoreMap.get(letterInPlay);
      if (!letterSavedScoreMap || (letterSavedScoreMap.length !== globalCatergoies.length)) {
        isAllScoresRecieved = false;
        return;
      }
      resultObj[user][letterInPlay] = usersSavedScoreMap.get(letterInPlay);
    })

    if (isAllScoresRecieved) {
      socket.broadcast.emit('all-answers-for-round-recieved', resultObj);
      socket.emit('all-answers-for-round-recieved', resultObj);
      usersWhoSubmittedScore = [];
      console.log('all-answers-for-round-recieved', resultObj);
    } else {
      console.log('all-answers-are not here for all users');
    }
  }

  socket.on('end-round', (data) => {
    console.log(getByValue(usersConnected, socket.id) + ' finished, ending the round, answers are:', data.answers)
    collectScores(getByValue(usersConnected, socket.id), data.answers, data.letterInPlay);
    socket.broadcast.emit('stop-get-answers');
  });

  socket.on('next-category', (data) => {
    socket.broadcast.emit('now-scoring', data.category)
    socket.emit('now-scoring', data.category)
    usersWhoSubmittedScore = [];
    socket.broadcast.emit('updated-score-user-list', usersWhoSubmittedScore);
    socket.emit('updated-score-user-list', usersWhoSubmittedScore)
  });

  socket.on('enable-score-button', (data) => {
    socket.emit('enable-score-button-true');
    socket.broadcast.emit('enable-score-button-true');
  });

  socket.on('send-results', (data) => {
    console.log(getByValue(usersConnected, socket.id) + ` forced to finish for round ${data.letterInPlay}, answers are:`, data.answers)
    collectScores(getByValue(usersConnected, socket.id), data.answers, data.letterInPlay)
    socket.broadcast.emit('stop-get-answers')
  });

  socket.on('final-round-score-submitted', (data) => {
    const user = getByValue(usersConnected, socket.id); 
    console.log(user + ` score for ${data.letter} is`, data.score);

    if (!scores) {
      scores = {};
    }

    if (scores[user]) {
      scores[user] += data.score ? data.score : 0;
    } else {
      scores[user] = data.score ? data.score : 0;
    }
    usersWhoSubmittedScore.push(data.userName);
    
    console.log('scores', scores[user]);
    
    socket.broadcast.emit('game-score-update', scores);
    socket.emit('game-score-update', scores);

    socket.broadcast.emit('updated-score-user-list', usersWhoSubmittedScore);
    socket.emit('updated-score-user-list', usersWhoSubmittedScore);
  });

  socket.on('category-score-submitted', (data) => {
    usersWhoSubmittedScore.push(data.userName);
    socket.broadcast.emit('updated-score-user-list', usersWhoSubmittedScore);
    socket.emit('updated-score-user-list', usersWhoSubmittedScore);
  })

  socket.on('game-over', (data) => {
    socket.broadcast.emit('game-over-over');
    socket.emit('game-over-over');
  })

});

httpServer.listen(3000, () => {
  console.log('websocket listening on *:3000');
});

app.listen(3001, () => {
  console.log('REST listening on *:3001');
})

function getByValue(map, searchValue) {
  for (let [key, value] of map.entries()) {
    if (value === searchValue)
      return key;
  }
}

function initGame() {
  lettersUsed = [];
  lettersRemaining = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
}

let lettersUsed = [];
let lettersRemaining = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
function getRandomLetter() {
  var letter = lettersRemaining[Math.floor(Math.random() * lettersRemaining.length)];
  lettersRemaining = lettersRemaining.filter(one => one !== letter);
  lettersUsed.push(letter);
  console.log(lettersRemaining.length);
  return letter.toUpperCase();
}