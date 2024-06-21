import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowUp, faMicrophone, faPlay, faTrash, faPaperPlane, faStop } from '@fortawesome/free-solid-svg-icons';

const AudioRecorder = (props) => {
    const { onSetIsRecording, setAudioMessages, toggleSpinner } = props;

    const [recording, setRecording] = useState(false);
    const [recorded, setRecorded] = useState(false);
    const [sessionStateBase64, setSessionStateBase64] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);
    const mediaStreamRef = useRef(null);

    const [audioSrc, setAudioSrc] = useState(null);
    const [audioDuration, setAudioDuration] = useState(null);

    const handleStartRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;
            mediaRecorder.current = new MediaRecorder(stream);
            audioChunks.current = [];

            mediaRecorder.current.ondataavailable = event => {
                audioChunks.current.push(event.data);
            };

            mediaRecorder.current.onstop = () => {
                const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
                setAudioBlob(audioBlob);
                setRecorded(true);
            };

            mediaRecorder.current.start();
            setRecording(true);
            onSetIsRecording(true);
        } catch (err) {
            console.error('Error starting recording', err);
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
            mediaRecorder.current.stop();
        }
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
        }
        setRecording(false);
        onSetIsRecording(false);
    };

    const deleteRecording = () => {
        handleStopRecording();
        setRecorded(false);
        setAudioBlob(null);
        setAudioSrc(null);
    };

    const handleToggleRecording = () => {
        if (recording) {
            handleStopRecording();
        } else {
            handleStartRecording();
        }
    };

    const uploadAudio = async () => {
        if (!audioBlob) {
            alert('No audio recorded');
            return;
        }

        const audioFile = new File([audioBlob], 'audio.wav', { type: 'audio/wav' });

        const formData = new FormData();
        formData.append('audio', audioFile);
        // if (sessionStateBase64 && Object.keys(sessionStateBase64).length >= 1) {
        // formData.append('sessionStateBase64', sessionStateBase64);
        // }

        toggleSpinner(true);

        // Send the audio and session state to your Node.js backend
        const response = await fetch('http://localhost:8080/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            console.error('Error uploading audio');
            toggleSpinner(false);
            return;
        }

        const data = await response.json();

        const { audio, inputTranscript, messages, sessionState } = data;

        setAudioSrc(`data:audio/mpeg;base64,${audio}`);
        setRecorded(false);
        setRecording(false);
        onSetIsRecording(false);
        setAudioMessages(messages, inputTranscript, sessionState['sessionAttributes']['TableauURL']);
        playAudio(audio);  // Play the audio
        calculateAudioDuration(audio);
        setSessionStateBase64(sessionState);
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

    const calculateAudioDuration = (audioBase64) => {
        const audioArrayBuffer = base64ToArrayBuffer(audioBase64);
        const audioBlob = new Blob([audioArrayBuffer], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.onloadedmetadata = () => {
            setAudioDuration(audio.duration * 1000); // duration in milliseconds
        };
    };

    return (
        <div className="audio-recorder">
            <i title={recording ? "Stop" : "Record"} onClick={handleToggleRecording} tool>
                {(recording && !recorded) && (
                    <FontAwesomeIcon style={{ color: "#d11a2a", height: 24, width: 24 }} icon={faStop} />
                )}
                {(!recording && !recorded) && (
                    <FontAwesomeIcon style={{ color: "#133a84", height: 24, width: 24 }} icon={faMicrophone} />
                )}
            </i>
            {(recorded && !recording) && (
                <>
                    <i title='Delete' onClick={deleteRecording}>
                        <FontAwesomeIcon style={{ color: "#d11a2a", height: 24, width: 24 }} icon={faTrash} />
                    </i>
                    <i title='Send' onClick={uploadAudio}>
                        <FontAwesomeIcon style={{ color: "#133a84", height: 24, width: 24 }} icon={faCircleArrowUp} />
                    </i>
                </>
            )}
            {audioSrc && <audio style={{ display: 'none' }} controls src={audioSrc}></audio>}
        </div>
    );
};

export default AudioRecorder;
