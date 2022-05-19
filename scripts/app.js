//  main.js
const getPlaylistKey = () => document.getElementById("plKey").value;
const list = document.getElementById("list");
const buttons = document.getElementById("buttons");
const playlistArray = [];
var arrayVideo = [];
const x = (JSON.parse(localStorage.getItem("playlistArray")));
const concatArray = playlistArray.concat(x);
localStorage.getItem("list");
document.getElementById("list").innerHTML = localStorage.getItem("list");
var index = 0;
var playlistCounter = (index + 1);
var numberOfSongs = 0;
const next = document.getElementById("nextButton");
const prev = document.getElementById("prevButton");

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
        list.innerHTML += `<li id="${json.id}" value="${json.title}" class="this-playlist""><div class="thumbnail-root"><img src=${json.thumbnail_url} class="thumbnail-img""></div>${json.title} <input type="button" value="Play" onclick="startPlaylist(this)"> <input type="button" value="Shuffle" onclick="shufflePlaylist(this)"> <input type="button" value="Delete" onclick="removePlaylist(this)"></li>`;
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
    document.getElementById("navbar").style.display="inline";
    var counter = 0;
    var filter = [];
    filter = concatArray.filter(obj=>obj);
    var filarr = filter.filter((value, index, self) =>
        index === self.findIndex((t) => (
        t.id === value.id
        ))
    )
    document.getElementById("videoList").innerHTML = `
                <ol id="oList">
            
                </ol>
            
        <br>`
    buttons.innerHTML = `<button type="button" id="prevButton" onclick="previousVideo()">Previous</button> <button type="button" id="nextButton" onclick="nextVideo()">Next</button>`
    for(var i = 0; i < filarr.length; i++){
        if(e.parentNode.id === filarr[i].id){
            numberOfSongs = filarr[i].videos.length;
            document.getElementById("playlistName").innerHTML = `${filarr[i].title}   <div id="plCounter">(${playlistCounter}/${numberOfSongs})</div>`
            var videoArray = filarr[i].videos;
            for(var i = 0; i < videoArray.length; i++){
                counter++;
                document.getElementById("oList").innerHTML += `<li value="${counter}" id="${videoArray[i].id}" onmousedown="selectVideo(this)"><div class="thumbnail-root"><img src=${videoArray[i].thumbnail_url} class="thumbnail-img""></div>${videoArray[i].title}</li>`

            }
            arrayVideo = videoArray;
            vid = videoArray[0].id;
            loadPlayer();
            return arrayVideo;
        }
    }
}

function shufflePlaylist(e){
    document.getElementById("playlists").style.display="none";
    document.getElementById("playlistForm").style.display="none";
    document.getElementById("navbar").style.display="inline";
    var counter = 0;
    var filter = [];
    filter = concatArray.filter(obj=>obj);
        var filarr = filter.filter((value, index, self) =>
        index === self.findIndex((t) => (
        t.id === value.id
        ))
    )
    document.getElementById("playlistName").innerHTML = `${e.parentNode.title}`
    document.getElementById("videoList").innerHTML = `
                <ol id="oList">
            
                </ol>
        <br>`
    buttons.innerHTML = `<button type="button" id="prevButton" onclick="previousVideo()">Previous</button> <button type="button" id="nextButton" onclick="nextVideo()">Next</button>`
    for(var i = 0; i < filarr.length; i++){
        if(e.parentNode.id === filarr[i].id){
            document.getElementById("playlistName").innerHTML = `${filarr[i].title}`
            var videoArray = filarr[i].videos;
            let currentIndex = videoArray.length, randomIndex
            while(currentIndex != 0){
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex--;

                [videoArray[currentIndex], videoArray[randomIndex]] = [videoArray[randomIndex], videoArray[currentIndex]];
            }
            for(var i = 0; i < videoArray.length; i++){
                counter++
                document.getElementById("oList").innerHTML += `<li value="${counter}" id="${videoArray[i].id}" onmousedown="selectVideo(this)"><div class="thumbnail-root"><img src=${videoArray[i].thumbnail_url} class="thumbnail-img""></div>${videoArray[i].title}</li>`
            }
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

//This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "//www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;

//creates an <iframe> (and YouTube player) after the API code downloads.
function loadPlayer(){
    
    player = new YT.Player('player', {
        height: '550',
        width: '580',
        videoId: vid,
        playerVars: {
            'playsinline': 1, 'autoplay': 1, 'start': 0, 'rel': 0
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
        if(index === arrayVideo.length-1){

        }
        else{
            index++;
            if(playlistCounter === numberOfSongs){
                playlistCounter = index;
            }
            else{
                playlistCounter = index + 1;
            }
            document.getElementById("plCounter").innerHTML = `(${playlistCounter}/${numberOfSongs})`;
            player.loadVideoById({
                videoId: arrayVideo[index].id,
                startSeconds: 0
            });
        }
    }
}
function stopVideo() {
    player.stopVideo();
}

function nextVideo(){
    if(index === arrayVideo.length-1){
        
    }
    else{
        index++;
        
        playlistCounter = index + 1;
        
        document.getElementById("plCounter").innerHTML = `(${playlistCounter}/${numberOfSongs})`;
        player.loadVideoById({
            videoId: arrayVideo[index].id,
            startSeconds: 0
        });
    }
}

function previousVideo(){
    if(index-1 === -1){

    }
    else{
        index--;
        if(playlistCounter === numberOfSongs){
            playlistCounter = index + 1;
        }
        else{
            playlistCounter = index + 1;
        }
        document.getElementById("plCounter").innerHTML = `(${playlistCounter}/${numberOfSongs})`;
        player.loadVideoById({
            videoId: arrayVideo[index].id,
            startSeconds: 0
        });
    }
}

function selectVideo(e){
    index = e.value-1;
    
    playlistCounter = index + 1;
    document.getElementById("plCounter").innerHTML = `(${playlistCounter}/${numberOfSongs})`;
    player.loadVideoById({
        videoId: e.id,
            startSeconds: 0
    });
}