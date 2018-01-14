window.___gcfg = { lang: 'en' };

var socket = io();

// If you modify this array, also update default language / dialect below.
var langs =
[['Afrikaans',       ['af-ZA']],
 ['????',           ['am-ET']],
 ['Az?rbaycanca',    ['az-AZ']],
 ['?????',            ['bn-BD', '????????'],
                     ['bn-IN', '????']],
 ['Bahasa Indonesia',['id-ID']],
 ['Bahasa Melayu',   ['ms-MY']],
 ['Català',          ['ca-ES']],
 ['Ceština',         ['cs-CZ']],
 ['Dansk',           ['da-DK']],
 ['Deutsch',         ['de-DE']],
 ['English',         ['en-AU', 'Australia'],
                     ['en-CA', 'Canada'],
                     ['en-IN', 'India'],
                     ['en-KE', 'Kenya'],
                     ['en-TZ', 'Tanzania'],
                     ['en-GH', 'Ghana'],
                     ['en-NZ', 'New Zealand'],
                     ['en-NG', 'Nigeria'],
                     ['en-ZA', 'South Africa'],
                     ['en-PH', 'Philippines'],
                     ['en-GB', 'United Kingdom'],
                     ['en-US', 'United States']],
 ['Español',         ['es-AR', 'Argentina'],
                     ['es-BO', 'Bolivia'],
                     ['es-CL', 'Chile'],
                     ['es-CO', 'Colombia'],
                     ['es-CR', 'Costa Rica'],
                     ['es-EC', 'Ecuador'],
                     ['es-SV', 'El Salvador'],
                     ['es-ES', 'España'],
                     ['es-US', 'Estados Unidos'],
                     ['es-GT', 'Guatemala'],
                     ['es-HN', 'Honduras'],
                     ['es-MX', 'México'],
                     ['es-NI', 'Nicaragua'],
                     ['es-PA', 'Panamá'],
                     ['es-PY', 'Paraguay'],
                     ['es-PE', 'Perú'],
                     ['es-PR', 'Puerto Rico'],
                     ['es-DO', 'República Dominicana'],
                     ['es-UY', 'Uruguay'],
                     ['es-VE', 'Venezuela']],
 ['Euskara',         ['eu-ES']],
 ['Filipino',        ['fil-PH']],
 ['Français',        ['fr-FR']],
 ['Basa Jawa',       ['jv-ID']],
 ['Galego',          ['gl-ES']],
 ['???????',           ['gu-IN']],
 ['Hrvatski',        ['hr-HR']],
 ['IsiZulu',         ['zu-ZA']],
 ['Íslenska',        ['is-IS']],
 ['Italiano',        ['it-IT', 'Italia'],
                     ['it-CH', 'Svizzera']],
 ['?????',             ['kn-IN']],
 ['?????????',          ['km-KH']],
 ['Latviešu',        ['lv-LV']],
 ['Lietuviu',        ['lt-LT']],
 ['??????',          ['ml-IN']],
 ['?????',             ['mr-IN']],
 ['Magyar',          ['hu-HU']],
 ['???',              ['lo-LA']],
 ['Nederlands',      ['nl-NL']],
 ['?????? ????',        ['ne-NP']],
 ['Norsk bokmål',    ['nb-NO']],
 ['Polski',          ['pl-PL']],
 ['Português',       ['pt-BR', 'Brasil'],
                     ['pt-PT', 'Portugal']],
 ['Româna',          ['ro-RO']],
 ['?????',          ['si-LK']],
 ['Slovenšcina',     ['sl-SI']],
 ['Basa Sunda',      ['su-ID']],
 ['Slovencina',      ['sk-SK']],
 ['Suomi',           ['fi-FI']],
 ['Svenska',         ['sv-SE']],
 ['Kiswahili',       ['sw-TZ', 'Tanzania'],
                     ['sw-KE', 'Kenya']],
 ['???????',       ['ka-GE']],
 ['???????',          ['hy-AM']],
 ['?????',            ['ta-IN', '???????'],
                     ['ta-SG', '???????????'],
                     ['ta-LK', '??????'],
                     ['ta-MY', '???????']],
 ['??????',           ['te-IN']],
 ['Ti?ng Vi?t',      ['vi-VN']],
 ['Türkçe',          ['tr-TR']],
 ['??????',            ['ur-PK', '???????'],
                     ['ur-IN', '?????']],
 ['????????',         ['el-GR']],
 ['?????????',         ['bg-BG']],
 ['P??????',          ['ru-RU']],
 ['??????',           ['sr-RS']],
 ['??????????',        ['uk-UA']],
 ['???',            ['ko-KR']],
 ['??',             ['cmn-Hans-CN', '??? (????)'],
                     ['cmn-Hans-HK', '??? (??)'],
                     ['cmn-Hant-TW', '?? (??)'],
                     ['yue-Hant-HK', '?? (??)']],
 ['???',           ['ja-JP']],
 ['??????',             ['hi-IN']],
 ['???????',         ['th-TH']]];

for (var i = 0; i < langs.length; i++) {
  select_language.options[i] = new Option(langs[i][0], i);
}
// Set default language / dialect.
select_language.selectedIndex = 10;
updateCountry();
select_dialect.selectedIndex = 11;

function updateCountry() {
  for (var i = select_dialect.options.length - 1; i >= 0; i--) {
    select_dialect.remove(i);
  }
  var list = langs[select_language.selectedIndex];
  for (var i = 1; i < list.length; i++) {
    select_dialect.options.add(new Option(list[i][1], list[i][0]));
  }
  select_dialect.style.visibility = list[1].length == 1 ? 'hidden' : 'visible';
}

var create_email = false;
var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;
var recognition = new webkitSpeechRecognition();
if (!('webkitSpeechRecognition' in window)) {
  recognizing = true;
} else {
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.start();

  recognition.onstart = function() {
    recognizing = true;
  };

  recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
      ignore_onend = true;
    }
    if (event.error == 'audio-capture') {
      ignore_onend = true;
    }
    if (event.error == 'not-allowed') {
      ignore_onend = true;
    }
  };

  recognition.onend = function() {
    recognizing = false;
    if (ignore_onend) {
      return;
    }
    if (!final_transcript) {
      return;
    }
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
      var range = document.createRange();
      range.selectNode(document.getElementById('final_span'));
      window.getSelection().addRange(range);
    }
  };

  recognition.onresult = function(event) {
    var interim_transcript = '';
    if (typeof(event.results) == 'undefined') {
      recognition.onend = null;
      recognition.stop();
      return;
    }
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
        
        /* Translation APIs */
        socket.emit('chat message', final_transcript);
        socket.on('chat message', function(msg) {
          $('#messages').append($('<li>').text(msg));
        });

      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
    final_transcript = capitalize(final_transcript);
    final_span.innerHTML = linebreak(final_transcript);
    interim_span.innerHTML = linebreak(interim_transcript);
  };
}

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

var first_char = /\S/;
function capitalize(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

function startButton(event) {
  if (recognizing) {
    recognition.stop();
    return;
  }
  final_transcript = '';
  recognition.lang = select_dialect.value;
  recognition.start();
  ignore_onend = false;
  final_span.innerHTML = '';
  interim_span.innerHTML = '';
  start_timestamp = event.timeStamp;
}

var current_style;