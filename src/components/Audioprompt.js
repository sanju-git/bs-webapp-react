import React, { useState, useRef } from 'react';

const App = () => {
    const [recording, setRecording] = useState(false);
    const [sessionStateBase64, setSessionStateBase64] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);

    const [audioSrc, setAudioSrc] = useState(null);
    const [transcript, setTranscript] = useState('');
    const [messages, setMessages] = useState('');
    
    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder.current = new MediaRecorder(stream);
        audioChunks.current = [];

        mediaRecorder.current.ondataavailable = event => {
            audioChunks.current.push(event.data);
        };

        mediaRecorder.current.onstop = () => {
            const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
            setAudioBlob(audioBlob);
            playAudioBlob(audioBlob);
        };

        mediaRecorder.current.start();
        setRecording(true);
    };

    const stopRecording = () => {
        mediaRecorder.current.stop();
        setRecording(false);
    };

    const playAudioBlob = (blob) => {
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        audio.play();
    };

    const uploadAudio = async () => {
        if (!audioBlob) {
            alert('No audio recorded');
            return;
        }

        const audioFile = new File([audioBlob], 'audio.wav', { type: 'audio/wav' });

        const formData = new FormData();
        formData.append('audio', audioFile);
        formData.append('sessionStateBase64', sessionStateBase64);

        // Send the audio and session state to your Node.js backend
        const response = await fetch('http://localhost:8080/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            console.error('Error uploading audio');
            return;
        }

        const data = await response.json();

        const { audio, inputTranscript, messages } = data;

        setAudioSrc(`data:audio/mpeg;base64,${audio}`);
        setTranscript(inputTranscript);
        setMessages(messages);

        playAudio(audio);  // Play the audio
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
            <button onClick={uploadAudio} disabled={!audioBlob}>
                Upload Audio
            </button>
            {audioSrc && <audio controls src={audioSrc}></audio>}
            {transcript && <p>Transcript: {transcript}</p>}
            {messages && <p>Messages: {messages}</p>}
        </div>
    );
};

export default App;
