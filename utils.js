function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function unique_by_key(array, key) {
  var seen = [];
  return array.filter(function(item) {
    if (seen.indexOf(item[key]) !== -1) {
      return false;
    }
    seen.push(item[key]);
    return true;
  })
}
