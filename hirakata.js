"use strict";

var dict = [];
var learn_dicts = [];
var quest_n = 0;
var begin_time;

var all_dicts = [
  {name: 'Азбука', id: 'kana'},
  {name: 'Кандзи', id: 'kanji'}
];

function on_dicts_change() {
  var tab_dicts = document.getElementsByClassName("tab-pane");
  for (var i = 0; i < tab_dicts.length; ++i) {
    var begin_btn = document.getElementById(tab_dicts[i].id + "_btn")
    begin_btn.disabled = !window[tab_dicts[i].id + "_dicts"].some(function(d) { return document.getElementById(d.dict).checked; })
  }
}

function on_begin() {
  var active_dicts = document.getElementsByClassName("tab-pane active")[0].id;
  var cookie_exp = new Date();
  cookie_exp.setDate(cookie_exp.getDate() + 360);
  document.cookie = "active_dicts=" + active_dicts + "; expires=" + cookie_exp.toUTCString();

  var cookies = "checked_dicts=";
  all_dicts.forEach(function(dicts_grp) {
    window[dicts_grp.id + '_dicts'].forEach(function(dict_desc) {
      var d = dict_desc.dict;
      if (document.getElementById(d).checked) {
        if (dicts_grp.id === active_dicts) {
          dict = dict.concat(window[d]);
          learn_dicts = learn_dicts.concat(dict_desc);
        }
        cookies = cookies + d + " ";
      }
    });
  });
  document.cookie = cookies + "; expires=" + cookie_exp.toUTCString();

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

  var errors_by_dict = {};
  learn_dicts.forEach(function(ld) {
    errors_by_dict[ld.dict] = {};
    errors_by_dict[ld.dict].str = "<br><br><b>" + ld.name + "</b>";
    errors_by_dict[ld.dict].empty = true;
  });

  for (var i = 0; i < dict.length; ++i) {
    if ('answer' in dict[i]) {
      errors_num++;
      learn_dicts.forEach(function(ld) {
        var dict_id = ld.dict;
        if (window[dict_id].some(function(e) {return e.jp === dict[i].jp})) {
          errors_by_dict[dict_id].str = errors_by_dict[dict_id].str + "<br>" + dict[i].jp + " : " + dict[i].ro + " (Ваш ответ '" + dict[i].answer + "')";
          errors_by_dict[dict_id].empty = false;
        }
      });
    } else {
      total_time = total_time + dict[i].time;
    }
  }

  for (var ed in errors_by_dict) {
    if (!errors_by_dict[ed].empty) {
      errors_str = errors_str + errors_by_dict[ed].str;
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

function create_tabs() {
  var $frm_nav = $('<ul>', {class: 'nav nav-tabs'});
  var $frm_tabs = $("<div>", {class: 'tab-content'});
  all_dicts.forEach(function(dicts_grp) {
    var grp_id = dicts_grp.id;
    var $frm_tab = $('<li>');
    var $frm_tab_ref = $('<a>', {'data-toggle': 'tab', href: "#" + grp_id, text: dicts_grp.name});
    $frm_tab.append($frm_tab_ref);
    $frm_nav.append($frm_tab);

    var $frm = $('<form>', {id: grp_id, class: 'tab-pane'});
    window[grp_id + "_dicts"].forEach(function(dict_desc) {
        var $chk_box = $('<div>', {class: 'checkbox'});
        var $chk_lbl = $('<label>', {text: dict_desc.name});
        var $chk_in = $('<input>', {id: dict_desc.dict, type: 'checkbox', onclick: 'on_dicts_change()'});
        $chk_lbl.prepend($chk_in);
        $chk_box.append($chk_lbl);
        $frm.append($chk_box);
    });
    var $btn = $('<input>', {id: grp_id + '_btn', type: 'button', class: 'btn btn-default', disabled: 'disabled', onclick: 'on_begin()', value: 'Начать'});
    $frm.append($btn);
    $frm_tabs.append($frm);
  });
  $("#frm_begin").append($frm_nav);
  $("#frm_begin").append($frm_tabs);
}

window.onload = function() {
  create_tabs();

  var matches = document.cookie.match(new RegExp("(?:^|; )checked_dicts=([^;]*)"));
  if (matches) {
    var dicts = matches[1].split(' ');
    for (var n = 0; n < dicts.length; ++n) {
      var elem = document.getElementById(dicts[n]);
      if (elem) {
        elem.checked = true;
      }
    }
  }

  var active_tab_id = 'kana';
  matches = document.cookie.match(new RegExp("(?:^|; )active_dicts=([^;]*)"));
  if (matches) {
    active_tab_id = matches[1];
  }

  $('.nav-tabs a[href="#' + active_tab_id + '"]').tab('show')

  on_dicts_change();
};
