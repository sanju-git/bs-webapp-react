import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowUp, faMicrophone, faTrash } from '@fortawesome/free-solid-svg-icons';

const AudioRecorder = (props) => {
    const { onSetIsRecording } = props;
    const [isRecording, setIsRecording] = useState(false);
    const [recorder, setRecorder] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const mediaStreamRef = useRef(null);

    const handleStartRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;
            const newRecorder = new MediaRecorder(stream);
            newRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    setAudioChunks((prev) => [...prev, event.data]);
                }
            };
            newRecorder.start();
            setRecorder(newRecorder);
            setIsRecording(true);
        } catch (error) {
            console.error('Microphone access denied', error);
            alert('Microphone access denied');
        }
    };

    const handleStopRecording = () => {
        recorder.stop();
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        setIsRecording(false);
    };

    const handleToggleRecording = () => {
        if (isRecording) {
            handleStopRecording();
            onSetIsRecording(false);
        } else {
            handleStartRecording();
            onSetIsRecording(true);
        }
    };

    useEffect(() => {
        if (!isRecording && audioChunks.length > 0) {
            const audioBlob = new Blob(audioChunks, { type: 'audio/l16; rate=16000' });
            handleSendAudio(audioBlob);
            setAudioChunks([]);
        }
    }, [isRecording, audioChunks]);

    const handleSendAudio = async (blob) => {
        try {
            const formData = new FormData();
            formData.append('audio', blob);
            formData.append('sessionId', 639); // Session ID or user ID

            const response = await fetch('http://localhost:8080/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to send audio file');
            }

            const audioData = await response.blob(); // Use blob() instead of arrayBuffer()
            const audioBlob = new Blob([audioData], { type: 'audio/mpeg' });

            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.play();
            window.open(audioUrl);
        } catch (error) {
            console.error('Error sending or playing audio:', error);
        }
    };


    return (
        <div className="audio-recorder">
            <i onClick={handleToggleRecording}>
                {isRecording ? (
                    <FontAwesomeIcon style={{ color: '#d11a2a', height: 24, width: 24 }} icon={faTrash} />
                ) : (
                    <FontAwesomeIcon style={{ color: '#133a84', height: 24, width: 24 }} icon={faMicrophone} />
                )}
            </i>
            {isRecording && (
                <i onClick={handleToggleRecording}>
                    <FontAwesomeIcon style={{ color: '#133a84', height: 24, width: 24 }} icon={faCircleArrowUp} />
                </i>
            )}
        </div>
    );
};

export default AudioRecorder;
