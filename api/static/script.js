document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById('start-btn');
    const countdownEl = document.getElementById('countdown');
    const progressEl = document.getElementById('progress');

    const audioPlayer = document.getElementById('audio-player');
    const audioControls = document.getElementById('audio-controls');
    const deleteButton = document.getElementById('delete-btn');
    const sendButton = document.getElementById('send-btn');
    let mediaRecorder;
    let audioChunks = [];
    let audioBlob;

    startButton.addEventListener('click', function () {
        startButton.disabled = true; // Disable button during the process
        let countdown = 3;

        countdownEl.textContent = countdown;
        countdownEl.classList.remove('hidden');
        const countdownInterval = setInterval(() => {
            countdown -= 1;
            countdownEl.textContent = countdown;

            if (countdown <= 0) {
                clearInterval(countdownInterval);
                countdownEl.classList.add('hidden');
                startRecording();
            }
        }, 1000);
    });

    function startRecording() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    mediaRecorder = new MediaRecorder(stream);
                    mediaRecorder.start();

                    audioChunks = [];
                    mediaRecorder.ondataavailable = function (event) {
                        audioChunks.push(event.data);
                    };

                    progressEl.classList.remove('hidden');
                    setTimeout(() => {
                        mediaRecorder.stop();
                    }, 5000); // Record for 5 seconds

                    mediaRecorder.onstop = function () {
                        audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                        audioPlayer.src = URL.createObjectURL(audioBlob);
                        audioPlayer.controls = true;
                        audioControls.style.display = "flex";

                        progressEl.classList.add('hidden');

                        startButton.disabled = false; // Enable button after process
                    };
                })
                .catch(error => console.error("Error accessing microphone:", error));
        }
    }

    deleteButton.addEventListener('click', function () {
        audioPlayer.src = '';
        audioPlayer.controls = false;
        audioControls.style.display = "none";
    });

    sendButton.addEventListener('click', function () {
        sendAudioToServer(audioBlob);
    });

    function sendAudioToServer(audioBlob) {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');

        fetch('https://voice-recognition-phi.vercel.app/upload', {
            method: 'POST',
            body: formData
        })
            .then(response => response.text())
            .then(data => {
                alert(data)
            })
            .catch(error => {
                console.error("Error:", error);

            });
    }
});
