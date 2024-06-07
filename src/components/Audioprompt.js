import React, { useState, useRef } from 'react';

const App = () => {
    const [recording, setRecording] = useState(false);
    const [sessionStateBase64, setSessionStateBase64] = useState(null);
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder.current = new MediaRecorder(stream);
        audioChunks.current = [];

        mediaRecorder.current.ondataavailable = event => {
            audioChunks.current.push(event.data);
        };

        mediaRecorder.current.onstop = async () => {
            const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
            const audioFile = new File([audioBlob], 'audio.wav', { type: 'audio/wav' });

            const formData = new FormData();
            formData.append('audio', audioFile);
            formData.append('sessionStateBase64', sessionStateBase64);

            // Send the audio and session state to your Node.js backend
            const response = await fetch('http://localhost:8080/upload', {
                method: 'POST',
                body: formData
            });

            const responseData = await response.json();
            playAudio(responseData.audio);
            setSessionStateBase64(responseData.sessionStateBase64);
        };

        mediaRecorder.current.start();
        setRecording(true);
    };

    const stopRecording = () => {
        mediaRecorder.current.stop();
        setRecording(false);
    };

    const playAudio = (audioBase64) => {
        const audioArrayBuffer = base64ToArrayBuffer(audioBase64);
        const audioBlob = new Blob([audioArrayBuffer], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
    };

    const base64ToArrayBuffer = (base64) => {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    };

    return (
        <div>
            <button onClick={recording ? stopRecording : startRecording}>
                {recording ? 'Stop Recording' : 'Start Recording'}
            </button>
        </div>
    );
};

export default App;
