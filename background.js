var url="http://localhost:5555/test";
var youtubeUrl="https://www.youtube.com/embed/";
var response=undefined;
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type == "playSong") {
        callServer(request.tabs);
        //response.url=youtubeUrl+response.url;
        var nir ={};
        sendResponse(nir);
    }


});
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
function callServer(tabs) {
    var response= new HttpClient();
    response.get(url,function(res){
        var response1=JSON.parse(res);
        var ur="https://www.youtube.com/watch?v="+response1.url
        var myChild= window.open(ur,'','width=,height=,resizable=no');
        myChild.blur();
        response=response1;
        response.url=youtubeUrl+response.url;
        chrome.runtime.sendMessage({type: "newSong",song: response}, function(res) {
			console.log("here");
        });
    },tabs);
}
