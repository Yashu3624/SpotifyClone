console.log("Lets start js");
let currentSong = new Audio();
let songs;
let currFolder;
let songTime = document.querySelector(".songtime"); 

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder){
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3001/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for(let index = 0 ; index < as.length ; index++){
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }
    updateSongList();
}

function updateSongList() {
    let songUL = document.querySelector(".songList ul");
    songUL.innerHTML = "";
    for(const song of songs){
        songUL.innerHTML += `<li>
            <img class="invert" src="img/music.svg" alt="">
            <div class="info">
                <div>${song.replaceAll("%20", " ")}</div>
                <div>xyz</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="img/play.svg" alt="">
            </div>
        </li>`;
    }

    Array.from(document.querySelectorAll(".songList li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        });
    });
    return songs
}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track;
    if (!pause) {
        currentSong.play();
        document.getElementById("play").src = "img/pause.svg"; // assuming you have an element with id "play"
    }
    
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    songTime.innerHTML = "00:00/00:00"; 
}
async function displayAlbums(){
    let a = await fetch(`http://127.0.0.1:3001/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
        for (let index = 0 ; index < array.length ; index++){
            const e = array[index];
        if(e.href.includes("/songs")&& !e.href.includes(".htaccess")){
           let folder =  e.href.split("/").slice(-2)[0]
           let a = await fetch(`http://127.0.0.1:3001/songs/${folder}/info.json`);
           let response = await a.json();
           console.log(response)
           cardContainer.innerHTML = cardContainer.innerHTML+`<div data-folder="${folder}" class="card ">
           <div class="play">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="black">
                   <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke-width="1.5" stroke-linejoin="round" />
                 </svg>
           </div>
           <img  src="/songs/${folder}/cover.jpg"  alt="" >
           <h2>${response.title}</h2>
           <p>${response.description}</p>
       </div>`
        }
    }
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0])
        });
    });
}
    

async function main() {
    const defaultFolder = "songs/Arijit";
    await getSongs(defaultFolder);
    //display all thr albums 
    displayAlbums();
    document.getElementById("play").addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            document.getElementById("play").src = "img/pause.svg";
        } else {
            currentSong.pause();
            document.getElementById("play").src = "img/play.svg";
        }
    });

    currentSong.addEventListener("timeupdate", () => {
        songTime.innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration) * percent / 100;
    });

    playMusic(songs[0], true);

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });

    previous.addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    // Add an event listener to next
    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/100");
        currentSong.volume = parseInt(e.target.value) / 100;
        if (currentSong.volume >0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        } 
    });

    document.querySelector(".volume>img").addEventListener("click" , e=>{
        console.log(e.target);
        if(e.target.src.includes("img/volume.svg")){
            e.target.src = e.target.src.replace("img/volume.svg","img/mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0 ;
        }
        else{
            e.target.src = e.target.src.replace("img/mute.svg","img/volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })


    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log("Setting volume to",e.target.values,"/100")
         currentSong.volume = parseInt(e.target.value)/100
     })
}
main();
