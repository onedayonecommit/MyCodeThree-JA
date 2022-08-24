let randomarr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const randomobj = {};
randomobj.randomfunc = function random() {
  var randomNumber = "";
  for (let i = 0; i < 6; i++) {
    let 랜덤뽑기숫자 = Math.floor(Math.random() * 10);
    randomNumber += randomarr[랜덤뽑기숫자];
  }
  return randomNumber;
};

module.exports = randomobj;
