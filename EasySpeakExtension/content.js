var speechText = '';
var final_transcript = '';
var selectedElement;
$(document).click(function(event) {
    
    
    /*
    $("input").each(function(index, element) {
        if ($(element).hasClass("js-search-field")) {
            $(element).val("TINOHACKS!!");
        }
    });*/
    var elem = $(event.target);
    console.log(elem.attr('type'));
    if ((elem.is("input") && elem.attr('type') == "text") 
                    || elem.is("textarea") 
                    || elem.is("textfield")) {
        selectedElement = $(event.target);
        console.log("input field detected");
    } else {
        console.log("no input field detected");
        selectedElement = null;
    }
});

var recognizing = false;
var recognition;
chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    if( request.message == "onclick" ) {
        startRecog(function(text) {
          
        });
    } else if (request.message == "stopRecording") {
        recognizing = false;
        recognition.stop();
    }
    
    if (request.message == "getRecordingStatus") {
        sendResponse(recognizing);
    }
    
    if (request.message == "getSpeech") {
        sendResponse(speechText);
    }
    
    if (request.message == "clearText") {
        speechText = "";
        final_transcript = "";
    }
});



function startRecog(callback) {
    final_transcript = '';
    
    var ignore_onend;
    var start_timestamp;
    showInfo('info_start');
    if (!('webkitSpeechRecognition' in window)) {
      upgrade();
    } else {
      //document.getElementById("start_button").style.display = 'inline-block';

        //sets up speech recog
      recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onstart = function() {
        recognizing = true;
        showInfo('info_speak_now');
          
       
      };

        //handles error
      recognition.onerror = function(event) {
        if (event.error == 'no-speech') {
          
          showInfo('info_no_speech');
          ignore_onend = true;
        }
        if (event.error == 'audio-capture') {
           
          showInfo('info_no_microphone');
          ignore_onend = true;
        }
        if (event.error == 'not-allowed') {
          if (event.timeStamp - start_timestamp < 100) {
            showInfo('info_blocked');
          } else {
            showInfo('info_denied');
          }
          ignore_onend = true;
        }
      };

        //handles ending speech recog
      recognition.onend = function() {
        recognizing = false;
        if (ignore_onend) {
          return;
        }
          
          
        
        if (!final_transcript) {
          showInfo('info_start');
          return;
        }
        showInfo('');
         
      };

        //prints out the speech
      recognition.onresult = function(event) {
        var interim_transcript = '';
        for (var i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final_transcript += event.results[i][0].transcript;
          } else {
            interim_transcript += event.results[i][0].transcript;
          }
        }
        final_transcript = capitalize(final_transcript);
          
          //console.log(final_transcript);
          speechText = final_transcript;
          
          if (selectedElement != null) {
              selectedElement.val(speechText);
          }
          
         
          callback && callback(final_transcript);
          
          
            
      };
    }



    function startButton() {
      if (recognizing) {
        recognition.stop();
        return;
      }
      final_transcript = '';
      recognition.lang = 'en-US';
      recognition.start();
      ignore_onend = false;
     
      showInfo('info_allow');
      
    }

    function upgrade() {
      showInfo('info_upgrade');
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

    function showInfo(s) {
     
    }
    startButton();
}



