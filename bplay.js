const video = document.getElementById('video');
const play = document.getElementById('play');
const stop = document.getElementById('stop');
const camera = document.getElementById('cam');
const expand = document.getElementById('expand');
const progress = document.getElementById('progress');
const timestamp = document.getElementById('timestamp');
const media = navigator.mediaDevices;


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


// Update progress & timestamp
function updateProgress() {
    progress.value = (video.currentTime / video.duration) * 100;

    // Get minutes 
    let mins = Math.floor(video.currentTime / 60);
    if (mins < 10) {
        mins = '0' + String(mins);
    }

    // Get seconds
    let secs = Math.floor(video.currentTime % 60);
    if (secs < 10) {
        secs = '0' + String(secs);
    }

    timestamp.innerHTML = `${mins}:${secs}`;
}


// Set video time to progress
function setVideoProgress() {
    video.currentTime = (+progress.value * video.duration) / 100;
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
// Event Listeners

video.addEventListener('click', toggleVideoStatus);
video.addEventListener('pause', updatePlayIcon);
video.addEventListener('play', updatePlayIcon);
video.addEventListener('timeupdate', updateProgress);
video.addEventListener('contextmenu', e => {
    e.preventDefault();
});

play.addEventListener('click', toggleVideoStatus);

stop.addEventListener('click', stopVideo);
stop.addEventListener('click', stopCam);

progress.addEventListener('change', setVideoProgress);
camera.addEventListener('click', startCam);
expand.addEventListener('click', openFullscreen);