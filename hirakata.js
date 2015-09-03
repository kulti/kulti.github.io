"use strict";

var dict = [];
var quest_n = 0;
var begin_time;

var dicts = ["hira", "kata", "hira_zv", "kata_zv", "hira_yo", "kata_yo", "basic", "unit_1", "unit_2"];
function on_dicts_chage() {
  document.getElementById("begin_btn").disabled = !dicts.some(function(d) { return document.getElementById(d).checked; });
}

function on_begin() {
  var cookies = "hirakata=";
  dicts.forEach(function(d) {
    if (document.getElementById(d).checked) {
      dict = dict.concat(window[d]);
      cookies = cookies + d + " ";
    }
  });
  var d = new Date();
  d.setDate(d.getDate() + 360);
  document.cookie = cookies + "; expires=" + d.toUTCString();

  var width_tester = document.getElementById("width_test");
  var quest_max_width = 0;
  var answer_max_width = 0;
  dict.forEach(function(e) {
      width_tester.innerHTML = e.jp;
      if (quest_max_width < width_tester.clientWidth) {
        quest_max_width = width_tester.clientWidth
      }
      e.ro.forEach(function(r) {
        width_tester.innerHTML = r;
        if (answer_max_width < width_tester.clientWidth) {
          answer_max_width = width_tester.clientWidth
        }
      });
  });

  document.getElementById("quest").style.width = (quest_max_width + 1) + "px";
  document.getElementById("answer").style.width = (answer_max_width + 1) + "px";

  dict = shuffle(dict);
  dict = unique_by_key(dict, 'jp');
  document.getElementById("frm_quest").style.display = "block";
  document.getElementById("frm_begin").style.display = "none";
  show_next_quest();
}

function on_key_press(e) {
  if(e.keyCode === 13) {
    var answer = document.getElementById("answer").value;
    if (dict[quest_n].ro.indexOf(answer) !== -1) {
      dict[quest_n].time = new Date().getTime() - begin_time;
    } else {
      dict[quest_n].answer = answer;
    }
    ++quest_n;
    if (quest_n === dict.length) {
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
  document.getElementById("results").innerHTML = "Осталось: " + (dict.length - quest_n);
  document.getElementById("quest").innerHTML = dict[quest_n].jp;
  document.getElementById("answer").value = "";
  document.getElementById("answer").focus();
  begin_time = new Date().getTime();
}

function show_results() {
  var errors_num = 0;
  var errors_str = "";
  var total_time = 0;
  for (var i = 0; i < dict.length; ++i) {
    if ('answer' in dict[i]) {
      errors_num++;
      errors_str = errors_str + "<br>" + dict[i].jp + " : " + dict[i].ro + " (Ваш ответ '" + dict[i].answer + "')";
    } else {
      total_time = total_time + dict[i].time;
    }
  }

  sort_dict_by_answer_time();
  var times_str = "";
  for (var i = 0; i < dict.length; ++i) {
    if ('time' in dict[i]) {
      times_str = times_str + "<br>" + dict[i].jp + " : " + dict[i].time/1000;
    }
  }
  document.getElementById("results").innerHTML = "<a href=\"javascript:history.go(0)\">Еще разок?</a><br>" + "Oшибок: " + errors_num + errors_str + "<br><br>Время на правильные ответы: " + total_time/1000 + times_str;
}

function sort_dict_by_answer_time() {
  for (var j = 0; j < dict.length; ++j) {
    for (var i = 0; i < dict.length - j - 1; ++i) {
      if (!('time' in dict[i + 1]) || (('time' in dict[i]) && (dict[i].time < dict[i + 1].time))) {
        var t = dict[i];
        dict[i] = dict[i + 1];
        dict[i + 1] = t;
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
  on_dicts_chage();
};
