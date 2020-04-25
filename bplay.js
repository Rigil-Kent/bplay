const video = document.getElementById('video');
const play = document.getElementById('play');
const stop = document.getElementById('stop');
const camera = document.getElementById('cam');
const expand = document.getElementById('expand');
const mute = document.getElementById('mute');
const player = document.getElementById('player');
const progress = document.getElementById('progress');
const volume = document.getElementById('volume');
const timestamp = document.getElementById('timestamp');
const media = navigator.mediaDevices;

const classPrefix = 'bplay_';
const poster = '';
const defaultVideoWidth = 480;
const defaultVideoHeight = 270;
const defaultAudioWidth = 400;
const defaultAudioHeight = 34;
const startVolume = 0.8;
let autoplay = false;
let autoRewind = true;
let hideVideoControlsOnLoad = false;
let hideVideoControlsOnPause = false;
let controlsTimeout = 1500;
let hideVolumeOnTouchDevices = true;
let tempVolume = 0;




function loadVideo(src) {
    video.srcObject = src;
}

function setVideoPoster(src) {
    video.poster = src;
}

// Play & Pause video
function toggleVideoStatus() {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
}


// Update play/pause icon
function updatePlayIcon() {
    if (video.paused) {
        play.innerHTML = '<i class="fa fa-play"></i>';
        play.title = 'Start Video Playback';
    } else {
        play.innerHTML = '<i class="fa fa-pause"></i>';
        play.title = 'Pause Video Playback';
    }
}

function updateVolume() {
    volume.value = video.volume;
    if (volume.value > 0.6) {
        mute.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else if (volume.value > 0) {
        mute.innerHTML = '<i class="fas fa-volume-down"></i>';
    } else {
        mute.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
}

// Update progress & timestamp
function updateProgress() {
    progress.value = (video.currentTime / video.duration) * 100;

    if (video.ended) {
        if (autoRewind) {
            video.currentTime = 0;
        }
    }

    let hours = undefined;
    // Get minutes 
    let mins = Math.floor(video.currentTime / 60);
    
    if (mins > 59) {
        hours = Math.floor(mins % 60);
        if (hours < 10) {
            hours = '0' + String(hours);
        }
    }

    if (mins < 10) {
        mins = '0' + String(mins);
    }

    // Get seconds
    let secs = Math.floor(video.currentTime % 60);
    if (secs < 10) {
        secs = '0' + String(secs);
    }

    if (hours !== undefined) {
        timestamp.innerHTML = `${hours}:${mins}:${secs}`;
    } else {
        timestamp.innerHTML = `${mins}:${secs}`;
    }
    
}


// Set video time to progress
function setVideoProgress() {
    video.currentTime = (+progress.value * video.duration) / 100;
}

function setVideoVolume() {
    video.volume = +volume.value;
}

function muteVideo() {
    if (video.volume > 0) {
        tempVolume = video.volume;
        video.volume = 0;
    } else {
        video.volume = tempVolume;
    }
}

//  Stop video
function stopVideo() {
    video.pause();
    stopCam();
    video.currentTime = 0;
}


function openFullscreen() {
    if (video.requestFullscreen) {
        video.requestFullscreen();
    } else if (video.mozRequestFullscreen) {
        video.mozRequestFullscreen();
    } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
    }
}


function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullscreen) {
        document.mozCancelFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

function startCam() {
    if (media) {
        media.getUserMedia({ video: true, audio: true }).then(
            function onSuccess(stream) {
                let cam = document.getElementById('video');
                camera.innerHTML = '<i class="fas fa-broadcast-tower"></i>';
                camera.classList.add('broadcast');
                camera.disabled = true;
                stop.alt, stop.title = 'Stop Broadcasting';
                camera.alt, camera.title = 'Broadcasting...';
                cam.autoplay = true;
                video.srcObject = stream;
            }
        ).catch(function onError() {
            alert('Fuck...');
        });
    } else {
        alert('Not supported');
    }
}


function stopCam() {
    const stream = video.srcObject;

    if (stream === null) return;

    const track = stream.getTracks();

    track.forEach((item) => {
        item.stop();
    });

    buttons.classList.remove('p-boost');
    video.srcObject = null;
    video.autoplay = false;
    play.innerHTML = '<i class="fa fa-play"></i>';
    camera.classList.remove('broadcast');
    camera.disabled = false;
    camera.innerHTML = '<i class="fas fa-video"></i>';
    camera.alt = 'Broadcast';
    camera.title = 'Broadcast Video';
    stop.alt = 'Stop';
    stop.title = 'Stop Video Playback';
}


function seekBackward () {
    return (video.duration * 0.05);
}
// Event Listeners

video.volume = startVolume;
video.addEventListener('click', toggleVideoStatus);
video.addEventListener('pause', updatePlayIcon);
video.addEventListener('play', updatePlayIcon);
video.addEventListener('timeupdate', updateProgress);
video.addEventListener('volumechange', updateVolume);
video.addEventListener('contextmenu', e => {
    e.preventDefault();
});

play.addEventListener('click', toggleVideoStatus);

stop.addEventListener('click', stopVideo);
stop.addEventListener('click', stopCam);

progress.addEventListener('change', setVideoProgress);
volume.addEventListener('change', setVideoVolume);
mute.addEventListener('click', muteVideo);
camera.addEventListener('click', startCam);
expand.addEventListener('click', openFullscreen);