//  main.js
const getPlaylistKey = () => document.getElementById("plKey").value;
const list = document.getElementById("list")
const ytPlayerAPI = document.getElementById("ytPlayerAPI");
const json = "";
const playlistArray = [];
var arrayVideo = [];
const x = (JSON.parse(localStorage.getItem("playlistArray")));
const concatArray = playlistArray.concat(x);
localStorage.getItem("list");
document.getElementById("list").innerHTML = localStorage.getItem("list");
var counter = 0;
var index = 0;

async function inputPlaylist(){
    plKey = getPlaylistKey();

    // POST request using fetch()
    await fetch("https://better-youtube-shuffle.herokuapp.com/", {
        // Adding method type
        method: "POST",
        // Adding body or contents to send
        body: JSON.stringify({
            playlistKey: `${plKey}`,
        }),
        // Adding headers to the request
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }   
    })
    // Converting to JSON
    .then(response => response.json())
    // Displaying results to console
    .then(function(json){
        console.log(json);
        playlistArray.push(json);
        concatArray.push(json);
        list.innerHTML += `<li id="${json.id}" class="this-playlist""><div class="thumbnail-root"><img src=${json.thumbnail_url} class="thumbnail-img""></div>${json.title} <input type="button" value="Play" onclick="startPlaylist(this)"> <input type="button" value="Shuffle" onclick="loadShuffle(this)"> <input type="button" value="Delete" onclick="removePlaylist(this)"></li>`;
        let y = localStorage.getItem("playlistArray");
        if(y){
            y = JSON.parse(y);
        }
        else{
            y = [];
        }
        y.push(json);
        localStorage.setItem("playlistArray", JSON.stringify(y));
        localStorage.setItem("list", list.innerHTML)
    });
}

function startPlaylist(e){
    document.getElementById("playlists").style.display="none";
    document.getElementById("playlistForm").style.display="none";
    var counter = 0;
    var filter = [];
    filter = concatArray.filter(obj=>obj);
    var filarr = filter.filter((value, index, self) =>
        index === self.findIndex((t) => (
        t.id === value.id
        ))
    )
    console.log(filarr);
    document.getElementById("mediaPlayer").innerHTML = `
                <ol id="oList">
            
                </ol>
            
        <br>`
    for(var i = 0; i < filarr.length; i++){
        if(e.parentNode.id === filarr[i].id){
            var videoArray = filarr[i].videos;
            for(var i = 0; i < videoArray.length; i++){
                counter++;
                document.getElementById("oList").innerHTML += `<li value="${counter}" id="${counter}"><div class="thumbnail-root"><img src=${videoArray[i].thumbnail_url} class="thumbnail-img""></div>${videoArray[i].title}</li>`
                
            }
            arrayVideo = videoArray;
            console.log(videoArray);
            vid = videoArray[0].id;
            loadPlayer();
            return arrayVideo;
        }
    }
}

function shufflePlaylist(e){
    document.getElementById("list").style.display="none";
    document.getElementsByClassName("playlists").style.display="none";
    var counter = 0;
    var filter = [];
    filter = concatArray.filter(obj=>obj);
        var filarr = filter.filter((value, index, self) =>
        index === self.findIndex((t) => (
        t.id === value.id
        ))
    )
    console.log(filarr);
    document.getElementById("mediaPlayer").innerHTML = `
                <ol id="oList">
            
                </ol>
        <br>`
    for(var i = 0; i < filarr.length; i++){
        if(e.parentNode.id === filarr[i].id){
            var videoArray = filarr[i].videos;
            let currentIndex = videoArray.length, randomIndex
            while(currentIndex != 0){
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex--;

                [videoArray[currentIndex], videoArray[randomIndex]] = [videoArray[randomIndex], videoArray[currentIndex]];
            }
            for(var i = 0; i < videoArray.length; i++){
                counter++
                document.getElementById("oList").innerHTML += `<li value="${counter}" id="${videoArray[i].id}"><div class="thumbnail-root"><img src=${videoArray[i].thumbnail_url} class="thumbnail-img""></div>${videoArray[i].title}</li>`
            }
            console.log(videoArray);
            arrayVideo = videoArray;
            vid = arrayVideo[0].id;
            loadPlayer();
            return arrayVideo;
        }
    }
}

function removePlaylist(e){
    e.parentNode.parentNode.removeChild(e.parentNode);
    localStorage.setItem("list", list.innerHTML);
}

function loadShuffle(e){
    shufflePlaylist(e);
    console.log(player.videoId);
}

// 2. This code loads the IFrame Player API code asynchronously.
var player;
function loadPlayer(){
    var tag = document.createElement('script');
    tag.src = "//www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    
    //creates an <iframe> (and YouTube player) after the API code downloads.
    player = new YT.Player('player', {
        height: '550',
        width: '600',
        videoId: vid,
        playerVars: {
            'playsinline': 1, 'autoplay': 1, 'start': 0
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

//The API will call this function when the video player is ready.
function onPlayerReady(event) {
    event.target.playVideo();
}

//The API calls this function when the player's state changes.
//The function indicates that when playing a video (state=1),
// the player should play for six seconds and then stop.
function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        index++;
        player.loadVideoById({
            videoId: arrayVideo[index].id,
            startSeconds: 0
        });
    }
}
function stopVideo() {
    player.stopVideo();
}