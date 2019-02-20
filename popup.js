window.onload=function(){
  // document.getElementById("button1").addEventListener("click", displayDate);
  chrome.windows.getAll({populate:true}, getAllOpenWindows);

}
function sendToBackground(tabs){
	chrome.runtime.sendMessage({type: "playSong",tabs: tabs},function(response) {
       console.log(response);
	   document.getElementById('iframeID').src =response.url;
	   var paragraph = document.getElementById("SongName");
	  var text = document.createTextNode(response.SongName);
	  paragraph.appendChild(text);
	});
}
function getAllOpenWindows(winData) {

  var tabs = [];
  for (var i in winData) {
    if (winData[i].focused === true) {
        var winTabs = winData[i].tabs;
        var totTabs = winTabs.length;
        for (var j=0; j<totTabs;j++) {
          tabs.push(winTabs[j].url);
        }	
    }
  }
  console.log(tabs);
  sendToBackground(tabs);
}
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type == "newSong") {
        console.log("here");
        document.getElementById('iframeID').src =request.song.url;
        var paragraph = document.getElementById("SongName");
        var text = document.createTextNode(request.song.SongName);
    }


});