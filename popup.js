window.onload=function(){
	document.getElementById("suitMe").addEventListener("click", pause);
	document.getElementById("nextSong").addEventListener("click", nextSongFunc);
	chrome.runtime.sendMessage({type: "loaded"},function(response) {
		if (response.song!=null)
		{
			document.getElementById('iframeID').src =response.song.url;
			var div = document.getElementById('SongName');
			var text = document.createTextNode(response.song.SongName);
			div.appendChild(text);
		}
	});
}
function sendToBackground(tabs){
	chrome.runtime.sendMessage({type: "playSong",tabs: tabs},function(response) {
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
function pause(){   
	chrome.runtime.sendMessage({type: "pause"},function(response) {
	});
	var iframe = document.getElementById('iframeID');
	var message = new Object();
	message.type = "pause";
	iframe.contentWindow.postMessage(message, '*'); 
}
function nextSongFunc(){
	chrome.windows.getAll({populate:true}, getAllOpenWindows);
}
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type == "newSong") {
        console.log("here");
        document.getElementById('iframeID').src =request.song.url;

		var div = document.getElementById('SongName');
		while(div.firstChild){
			div.firstChild.innerHTML="";
		}
		var text = document.createTextNode("Now Playing : "+response.song.SongName);;
		div.appendChild(text);
    }
	   if (request.type == "seekTo") {
		var toSend= new Object();
		toSend.type = 'seekTo';
		toSend.time=request.song.duration;
		toSend.playing=request.song.playing;
		seekToTime = toSend;
    }
});
window.addEventListener("message", receiveMessage, false);
function receiveMessage(event)
{
  var data = event.data;
  if (data.type === 'ready')
  {
	 if (seekToTime != null ){
		var iframe = document.getElementById('iframeID');
		iframe.contentWindow.postMessage(seekToTime, '*');
		seekToTime = null;
	 }
  }
   if (data.type === 'sendPause')
  {
	 var iframe = document.getElementById('iframeID');
	var message = new Object();
	message.type = "pause";
	iframe.contentWindow.postMessage(message, '*'); 
  }
}
var seekToTime = null ;