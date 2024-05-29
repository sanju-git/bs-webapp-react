import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowUp, faMicrophone, faPlay, faTrash, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const AudioRecorder = (props) => {
    const { onSetIsRecording } = props;
    const [isRecording, setIsRecording] = useState(false);
    const [recorder, setRecorder] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [recordings, setRecordings] = useState([]);
    const mediaStreamRef = useRef(null);

    const handleStartRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        const newRecorder = new MediaRecorder(stream);
        newRecorder.ondataavailable = event => {
            if (event.data.size > 0) {
                setAudioChunks(prev => [...prev, event.data]);
            }
        };
        newRecorder.start();
        setRecorder(newRecorder);
        setIsRecording(true);
    };

    const handleStopRecording = () => {
        recorder.stop();
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
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
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const url = URL.createObjectURL(audioBlob);
            setRecordings(prev => [...prev, { url, blob: audioBlob }]);
            setAudioChunks([]);
        }
    }, [isRecording, audioChunks]);

    const handlePlayAudio = (url) => {
        const audio = new Audio(url);
        audio.play();
    };

    const handleSendAudio = async (blob) => {
        const formData = new FormData();
        formData.append('audio', blob, 'recording.wav');

        try {
            const response = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                console.log('Audio file successfully sent to the server');
            } else {
                console.error('Failed to send audio file');
            }
        } catch (error) {
            console.error('Error sending audio file:', error);
        }
    };

    const handleDeleteRecording = (index) => {
        setRecordings(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="audio-recorder">
            <i onClick={handleToggleRecording}>
                {isRecording ? (
                    <FontAwesomeIcon style={{ color: "#d11a2a", height: 24, width: 24 }} icon={faTrash} />
                ) : (
                    <FontAwesomeIcon style={{ color: "#133a84", height: 24, width: 24 }} icon={faMicrophone} />
                )}
            </i>
            {isRecording && (
                <i onClick={handleToggleRecording}>
                    <FontAwesomeIcon style={{ color: "#133a84", height: 24, width: 24 }} icon={faCircleArrowUp} />
                </i>
            )}
            {/* <div className="recordings-list">
                {recordings.map((recording, index) => (
                    <div key={index} className="recording-item">
                        <audio controls src={recording.url}></audio>
                        <i onClick={() => handlePlayAudio(recording.url)}>
                            <FontAwesomeIcon style={{ color: "#133a84", height: 24, width: 24 }} icon={faPlay} />
                        </i>
                        <i onClick={() => handleSendAudio(recording.blob)}>
                            <FontAwesomeIcon style={{ color: "#133a84", height: 24, width: 24 }} icon={faPaperPlane} />
                        </i>
                        <i onClick={() => handleDeleteRecording(index)}>
                            <FontAwesomeIcon style={{ color: "#d11a2a", height: 24, width: 24 }} icon={faTrash} />
                        </i>
                    </div>
                ))}
            </div> */}
        </div>
    );
};

export default AudioRecorder;
