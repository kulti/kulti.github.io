var index;
var errors;
var times;
var dict = new Array();
var hira = new Array("あ", "い", "う", "え", "お", "か", "き", "く", "け", "こ", "さ", "し", "す", "せ", "そ", "た", "ち", "つ", "て", "と", "な", "に", "ぬ", "ね", "の", "は", "ひ", "ふ", "へ", "ほ", "ま", "み", "む", "め", "も", "や", "ゆ", "よ", "ら", "り", "る", "れ", "ろ", "わ", "ん", "を");
var kata = new Array("ア", "イ", "ウ", "エ", "オ", "カ", "キ", "ク", "ケ", "コ", "サ", "シ", "ス", "セ", "ソ", "タ", "チ", "ツ", "テ", "ト", "ナ", "ニ", "ヌ", "ネ", "ノ", "ハ", "ヒ", "フ", "ヘ", "ホ", "マ", "ミ", "ム", "メ", "モ", "ヤ", "ユ", "ヨ", "ラ", "リ", "ル", "レ", "ロ", "ワ", "ン", "ヲ");
var hira_zv = new Array("が", "ぎ", "ぐ", "げ", "ご", "ざ", "じ", "ず", "ぜ", "ぞ", "だ", "ぢ", "づ", "で", "ど", "ば", "び", "ぶ", "べ", "ぼ", "ぱ", "ぴ", "ぷ", "ぺ", "ぽ");
var kata_zv = new Array("ガ", "ギ", "グ", "ゲ", "ゴ", "ザ", "ジ", "ズ", "ゼ", "ゾ", "ダ", "ヂ", "ヅ", "デ", "ド", "バ", "ビ", "ブ", "ベ", "ボ", "パ", "ピ", "プ", "ペ", "ポ");
var hira_yo = new Array("きゃ", "きゅ", "きょ", "しゃ", "しゅ", "しょ", "ちゃ", "ちゅ", "ちょ", "にゃ", "にゅ", "にょ", "ひゃ", "ひゅ", "ひょ", "みゃ", "みゅ", "みょ", "りゃ", "りゅ", "りょ", "ぎゃ", "ぎゅ", "ぎょ", "じゃ", "じゅ", "じょ", "ぢゃ", "ぢゅ", "ぢょ", "びゃ", "びゅ", "びょ", "ぴゃ", "ぴゅ", "ぴょ");
var kata_yo = new Array("キャ", "キュ", "キョ", "シャ", "シュ", "ショ", "チャ", "チュ", "チョ", "ニャ", "ニュ", "ニョ", "ヒャ", "ヒュ", "ヒョ", "ミャ", "ミュ", "ミョ", "リャ", "リュ", "リョ", "ギャ", "ギュ", "ギョ", "ジャ", "ジュ", "ジョ", "ヂャ", "ヂュ", "ヂョ", "ビャ", "ビュ", "ビョ", "ピャ", "ピュ", "ピョ");
var roma = new Array();
var roma_hira = new Array("a", "i", "u", "e", "o", "ka", "ki", "ku", "ke", "ko", "sa", "shi", "su", "se", "so", "ta", "chi", "tsu", "te", "to", "na", "ni", "nu", "ne", "no", "ha", "hi", "fu", "he", "ho", "ma", "mi", "mu", "me", "mo", "ya", "yu", "yo", "ra", "ri", "ru", "re", "ro", "wa", "n", "wo");
var roma_hira_zv = new Array("ga", "gi", "gu", "ge", "go", "za", "ji", "zu", "ze", "zo", "da", "di", "du", "de", "do", "ba", "bi", "bu", "be", "bo", "pa", "pi", "pu", "pe", "pu");
var roma_hira_yo = new Array("kya", "kyu", "kyo", "sha", "shu", "sho", "cha", "chu", "cho", "nya", "nyu", "nyo", "hya", "hyu", "hyo", "mya", "myu", "myo", "rya", "ryu", "ryo", "gya", "gyu", "gyo", "ja", "ju", "jo", "dya", "dyu", "dyo", "bya", "byu", "byo", "pya", "pyu", "pyo");
var roma_kata = roma_hira;
var roma_kata_zv = roma_hira_zv;
var roma_kata_yo = roma_hira_yo;
var quest_n = 0;
var begin_time;

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

var dicts = ["hira", "kata", "hira_zv", "kata_zv", "hira_yo", "kata_yo"];
function on_dicts_chage() {
  for (var n = 0; n < dicts.length; ++n) {
    if (document.getElementById(dicts[n]).checked) {
      document.getElementById("begin_btn").disabled = false;
      return;
    }
  }
  document.getElementById("begin_btn").disabled = true;
}

function on_begin() {
  var cookies = "hirakata=";
  for (var n in dicts) {
    var d = dicts[n];
    if (document.getElementById(d).checked) {
      dict = dict.concat(window[d]);
      roma = roma.concat(window["roma_" + d]);
      cookies = cookies + d + " ";
    }
  }
  var d = new Date();
  d.setDate(d.getDate() + 360);
  document.cookie = cookies + "; expires=" + d.toUTCString();
  index = new Array;
  times = new Array;
  for (var i = 0; i < dict.length; ++i) {
    index[i] = i;
    times[i] = 0;
  }
  errors = new Array(index.length);
  shuffle(index);

  document.getElementById("frm_quest").style.display = "block";
  document.getElementById("frm_begin").style.display = "none";
  show_next_quest();
}

function on_key_press(e) {
  if(e.keyCode === 13) {
    if (roma[index[quest_n]] === document.getElementById("answer").value) {
      times[index[quest_n]] = new Date().getTime() - begin_time;
    } else {
      errors[quest_n] = document.getElementById("answer").value;
    }
    ++quest_n;
    if (quest_n === index.length) {
      document.getElementById("frm_quest").style.display = "none";
      show_results();
    } else {
      show_next_quest();
    }
    return false;
  }
  return true;
}

function show_next_quest() {
  document.getElementById("results").innerHTML = "Осталось: " + (index.length - quest_n);
  document.getElementById("quest").innerHTML = dict[index[quest_n]] + " : ";
  document.getElementById("answer").value = "";
  document.getElementById("answer").focus();
  begin_time = new Date().getTime();
}

function show_results() {
  var errors_num = 0;
  var errors_str = "";
  var total_time = 0;
  for (var i = 0; i < errors.length; ++i) {
    if (errors[i] === "" || errors[i]) {
      errors_num++;
      errors_str = errors_str + "<br>" + dict[index[i]] + " : " + roma[index[i]] + " (Ваш ответ '" + errors[i] + "')"
    } else {
      total_time = total_time + times[index[i]];
    }
  }

  sort_index_by_time();
  var times_str = "";
  for (var i = 0; i < times.length; ++i) {
    if (times[index[i]]) {
      times_str = times_str + "<br>" + dict[index[i]] + " : " + times[index[i]]/1000;
    }
  }
  document.getElementById("results").innerHTML = "<a href=\"javascript:history.go(0)\">Еще разок?</a><br>" + "Oшибок: " + errors_num + errors_str + "<br>Время на правильные ответы: " + total_time/1000 + times_str;
}

function sort_index_by_time() {
  for (var j = 0; j < index.length; ++j) {
    for (var i = 0; i < index.length - j - 1; ++i) {
      if (times[index[i]] < times[index[i + 1]]) {
        var t = index[i];
        index[i] = index[i + 1];
        index[i + 1] = t;
      }
    }
  }
}

window.onload = function() {
  var matches = document.cookie.match(new RegExp("(?:^|; )hirakata=([^;]*)"));
  if (!matches) {
    return;
  }

  var dicts = matches[1].split(' ');
  for (var n = 0; n < dicts.length; ++n) {
    var elem = document.getElementById(dicts[n]);
    if (elem) {
      elem.checked = true;
    }
  }
}
