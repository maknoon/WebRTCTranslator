window.___gcfg = { lang: 'en' };

var socket = io();

socket.on('chat message', function(msg) {
  $('#messages').append($('<li>').text(msg));
});

// If you modify this array, also update default language / dialect below.
var langs =
[['Afrikaans','af'],
['Albanian','sq'],
['Amharic','am'],
['Arabic','ar'],
['Armenian','hy'],
['Azeerbaijani','az'],
['Basque','eu'],
['Belarusian','be'],
['Bengali','bn'],
['Bosnian','bs'],
['Bulgarian','bg'],
['Catalan','ca'],
['Cebuano','ceb'],
['Chinese','zh-CN'],
['Chinese','zh-TW'],
['Corsican','co'],
['Croatian','hr'],
['Czech','cs'],
['Danish','da'],
['Dutch','nl'],
['English','en'],
['Esperanto','eo'],
['Estonian','et'],
['Finnish','fi'],
['French','fr'],
['Frisian','fy'],
['Galician','gl'],
['Georgian','ka'],
['German','de'],
['Greek','el'],
['Gujarati','gu'],
['Haitian','ht'],
['Hausa','ha'],
['Hawaiian','haw'],
['Hebrew','iw'],
['Hindi','hi'],
['Hmong','hmn'],
['Hungarian','hu'],
['Icelandic','is'],
['Igbo','ig'],
['Indonesian','id'],
['Irish','ga'],
['Italian','it'],
['Japanese','ja'],
['Javanese','jw'],
['Kannada','kn'],
['Kazakh','kk'],
['Khmer','km'],
['Korean','ko'],
['Kurdish','ku'],
['Kyrgyz','ky'],
['Lao','lo'],
['Latin','la'],
['Latvian','lv'],
['Lithuanian','lt'],
['Luxembourgish','lb'],
['Macedonian','mk'],
['Malagasy','mg'],
['Malay','ms'],
['Malayalam','ml'],
['Maltese','mt'],
['Maori','mi'],
['Marathi','mr'],
['Mongolian','mn'],
['Myanmar','my'],
['Nepali','ne'],
['Norwegian','no'],
['Nyanja','ny'],
['Pashto','ps'],
['Persian','fa'],
['Polish','pl'],
['Portuguese','pt'],
['Punjabi','pa'],
['Romanian','ro'],
['Russian','ru'],
['Samoan','sm'],
['Scots','gd'],
['Serbian','sr'],
['Sesotho','st'],
['Shona','sn'],
['Sindhi','sd'],
['Sinhala','si'],
['Slovak','sk'],
['Slovenian','sl'],
['Somali','so'],
['Spanish','es'],
['Sundanese','su'],
['Swahili','sw'],
['Swedish','sv'],
['Tagalog','tl'],
['Tajik','tg'],
['Tamil','ta'],
['Telugu','te'],
['Thai','th'],
['Turkish','tr'],
['Ukrainian','uk'],
['Urdu','ur'],
['Uzbek','uz'],
['Vietnamese','vi'],
['Welsh','cy'],
['Xhosa','xh'],
['Yiddish','yi'],
['Yoruba','yo'],
['Zulu','zu']]

for (var i = 0; i < langs.length; i++) {
  select_language.options[i] = new Option(langs[i][0], i);
}
// Set default language / dialect.
select_language.selectedIndex = 24;
updateCountry();

function updateCountry() {
  var countrySelection = document.getElementById("select_language");
  console.log("Mike test " + countrySelection.options[countrySelection.selectedIndex].value);
  //console.log("Mike test " + ((langs[select_language.selectedIndex][1]))[select_dialect.selectedIndex]);
  //socket.emit('change language', ((langs[select_language.selectedIndex][1]))[select_dialect.selectedIndex]);
  //console.log("Mike test " + ((langs[select_language.selectedIndex][1]))[select_dialect.selectedIndex]);
  socket.emit('change language', (langs[countrySelection.options[countrySelection.selectedIndex].value])[1]);
}

var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;
var recognition = new webkitSpeechRecognition();

recognition.continuous = true;
recognition.interimResults = true;
recognition.start();

recognition.onstart = function() {
  recognizing = true;
};

recognition.onerror = function(event) {
};

recognition.onend = function() {
  recognizing = false;

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
      final_transcript = '';
    } else {
      interim_transcript += event.results[i][0].transcript;
    }
  }
  final_transcript = capitalize(final_transcript);
  final_span.innerHTML = linebreak(final_transcript);
  interim_span.innerHTML = linebreak(interim_transcript);
};

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

var first_char = /\S/;
function capitalize(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}