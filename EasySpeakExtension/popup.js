

document.addEventListener('DOMContentLoaded', function() {
  var checkPageButton = document.getElementById('start_img');
    var recording = false;
    
    doInCurrentTab(function(tab) {
        chrome.tabs.sendMessage(tab.id, {"message": "getRecordingStatus"}, function(status) {
            //console.log(status);
            recording = status;
            if (recording) {
                start_img.src = 'Res/mic-animate.gif';
            }
        });   
    });
    
    
  checkPageButton.addEventListener('click', function() {
      var activeTabId;
      recording = !recording;
      
      doInCurrentTab( function(tab){
          if (recording) {
              start_img.src = 'Res/mic-animate.gif';
              chrome.tabs.sendMessage(tab.id, {"message": "onclick"}, function(tabs) {}); 
          } else {
              start_img.src = "Res/mic.gif";
              chrome.tabs.sendMessage(tab.id, {"message": "stopRecording"}, function(tabs) {}); 
          }
          
      });
  }, false);
   
  document.getElementById("displayButton").addEventListener('click', function() {
      updateText();
  });
    
    document.getElementById("clearButton").addEventListener('click', function() {
       doInCurrentTab(function(tab) {
           chrome.tabs.sendMessage(tab.id, {"message": "clearText"}, function(tabs) {});
       });
        updateText();
    });
    
}, false);

function doInCurrentTab(tabCallback) {
    chrome.tabs.query(
        { currentWindow: true, active: true },
        function (tabArray) { tabCallback(tabArray[0]); }
    );
}

 function updateText() {
     doInCurrentTab(function(tab) {
        chrome.tabs.sendMessage(tab.id, {"message": "getSpeech"}, function(value) {
            if (value != null) {
                console.log("TEXT: " + value);
                document.getElementById("speechDisplayer").innerHTML = value;
            } else {
                document.getElementById("speechDisplayer").innerHTML = "";
            }
        }); 
     });
 }


