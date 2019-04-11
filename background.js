var url="http://localhost:5555/test";
var youtubeUrl="http://localhost:4000/?url=https://youtu.be/";
var response=undefined;
var nextSongPlay = null;
var songsPlayers = [];
var needToSend = true;
var iframe = document.createElement('iframe');
var nowPlaying = null;
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type == "playSong") {
		nextSong();
    }
	if (request.type == "pause") {
		 var message = new Object();
		 message.type = "pause";
		iframe.contentWindow.postMessage(message, '*'); 
    }
	if (request.type == "loaded") {
		var message = new Object();
		message.type = "getTime";
		iframe.contentWindow.postMessage(message, '*'); 
		sendResponse({song: nowPlaying});		
    }
	if (request.type == "seekTo") {

	}
});
function receiveMessage(event)
{
  var data = event.data;
  if (data.type === 'ended')
  {
	 nextSong();
  }
  if (data.type === 'currentTime')
  {
	  nowPlaying.duration = data.duration;
	  nowPlaying.playing=data.playing;
	  chrome.runtime.sendMessage({type: "seekTo",song: nowPlaying}, function(res) {
       });
  }
}
function nextSong() 
{
  if ( nextSongPlay == null )
  {
	  if (needToSend == true )
		  initiateNext();
	  needToSend = true;
  }
  else
  {
		sendToClientAndInitiateSong(nextSongPlay); 
		nextSongPlay=null;
		needToSend = false;
		initiateNext();
  } 
}
function sendToClientAndInitiateSong(songToSend)
{
		  chrome.runtime.sendMessage({type: "newSong",song: songToSend}, function(res) {
        });
	    iframe.setAttribute("src", songToSend.url);
        document.body.appendChild(iframe);
		nowPlaying = songToSend;
		var objTopush = new Object();
		objTopush.song=nowPlaying.SongName;
		objTopush.artist=nowPlaying.SongArtist;		
		songsPlayers.push(objTopush);
}
function initiateNext()
{
		  chrome.tabs.getAllInWindow(null, function(tabs){
		var tabArray=[];
		for (var i = 0; i < tabs.length; i++) {			
			// send only 1 tab - active tab
			if (tabs[i].active)
				tabArray.push(tabs[i].url);
		}
		var response= new HttpClient();
		var objectToServer = new Object();
		objectToServer.tabs=tabArray;
		objectToServer.songArray=songsPlayers;
		response.get(url,function(res){
			var response1=JSON.parse(res);
			response=response1;
			response.id=response.url;
			response.url=youtubeUrl+response.url;
			nextSongPlay= response;
			if (needToSend)
			{
				sendToClientAndInitiateSong(nextSongPlay);
				nextSongPlay = null ;
				needToSend = false;
				initiateNext();
			}
		},objectToServer);	
	});
}
window.addEventListener("message", receiveMessage, false);
var HttpClient = function ()
{
    this.get = 	function (theUrl, callback,data)
    {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                callback(xmlHttp.responseText);
        }
        xmlHttp.open("POST", theUrl, true); // true for asynchronous
        console.log(JSON.stringify(data));
        xmlHttp.send(JSON.stringify(data));
    }
}
