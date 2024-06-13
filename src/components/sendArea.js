import React, { useState } from 'react';
import AudioRecorder from './audioRecorder';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import Stopwatch from './stopwatch';
import Wave from './siriWave';


const SendArea = (props) => {
    const { onSendMessage, setAudioMessages, toggleSpinner } = props;
    const [isRecording, setIsRecording] = useState(false);
    const [inputText, setInputText] = useState('');
    const handleChange = (e) => {
        setInputText(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend()
        }
    };

    const handleSend = () => {
        if (inputText.trim() === '') return;
        onSendMessage(inputText)
        setInputText('');
    }

    const onSetIsRecording = (isRecording) => {
        setIsRecording(isRecording);
    }
    return (
        <div className="msg-box">
            {(isRecording && isRecording == true) ? (
                // <div className="recording-indicator d-flex">
                //     <div>Recording...
                //     </div>
                //     <div className='ml-1'><Stopwatch />
                //     </div></div>
                <Wave />
            ) : (
                <input
                    type="text"
                    className="ip-msg"
                    value={inputText}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                />
            )}

            {(inputText && inputText.length >= 1) ? (
                <span className="btn-group" onClick={handleSend}>
                    <FontAwesomeIcon style={{ color: "#133a84", height: 24, width: 24 }} icon={faPaperPlane} />
                </span>
            ) : (
                <span className="btn-group">
                    <AudioRecorder setAudioMessages={setAudioMessages} toggleSpinner={toggleSpinner} onSetIsRecording={onSetIsRecording} />
                </span>
            )}

        </div>
    )
}

export default SendArea;