import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowUp,
  faMicrophone,
  faTrash,
  faCircleMinus,
} from "@fortawesome/free-solid-svg-icons";

const AudioRecorder = (props) => {
  const {
    onSetIsRecording,
    setAudioMessages,
    toggleSpinner,
    onSetShowArcSpinner,
    showSpinner,
    sessionId,
    language,
    clearConversation
  } = props;

  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const mediaStreamRef = useRef(null);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.start();
      setRecording(true);
      onSetIsRecording(true);
    } catch (err) {
      console.error("Error starting recording", err);
    }
  };

  const handleStopRecording = () => {
    return new Promise((resolve) => {
      if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
        mediaRecorder.current.onstop = () => {
          const audioBlob = new Blob(audioChunks.current, {
            type: "audio/wav",
          });
          setAudioBlob(audioBlob);
          resolve(audioBlob);
        };
        mediaRecorder.current.stop();
      } else {
        resolve(null);
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      setRecording(false);
      onSetIsRecording(false);
    });
  };

  const deleteRecording = () => {
    handleStopRecording().then(() => {
      setAudioBlob(null);
    });
  };

  const uploadAudio = async () => {
    const blob = await handleStopRecording();
    if (!blob) {
      console.error("No audio recorded");
      return;
    }

    const audioFile = new File([blob], "audio.wav", { type: "audio/wav" });

    const formData = new FormData();
    formData.append("audio", audioFile);
    formData.append("sessionId", sessionId);
    formData.append("language", language);

    toggleSpinner(true, "audioPrompt");
    onSetShowArcSpinner(true);
    setAudioBlob(null);

    try {
      const response = await fetch('https://friday.internal.dev.apps.bsci.com/api/upload', {
      // const response = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        console.error("Error uploading audio");
        toggleSpinner(false, "audioPrompt");
        onSetShowArcSpinner(false);
        return;
      }

      const data = await response.json();

      const { audio, inputTranscript, messages, sessionState } = data;

      setAudioBlob(null);
      toggleSpinner(false, "audioPrompt");
      onSetShowArcSpinner(false);
      setAudioMessages(
        false,
        messages,
        inputTranscript,
        sessionState["sessionAttributes"]["TableauURL"]
      );
      playAudio(audio);
    } catch (error) {
      console.error("Error during upload:", error);
      toggleSpinner(false, "audioPrompt");
      onSetShowArcSpinner(false);
      setAudioMessages(true);
    }
  };

  const playAudio = (audioBase64) => {
    const audioArrayBuffer = base64ToArrayBuffer(audioBase64);
    const audioBlob = new Blob([audioArrayBuffer], { type: "audio/mpeg" });
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
    <div className="audio-recorder">
      {!recording && !audioBlob && (
        <>
          <i
            title="Start Recording"
            className={showSpinner ? "disabled" : ""}
            onClick={handleStartRecording}
          >
            <FontAwesomeIcon
              style={{ color: "#133a84", height: 24, width: 24 }}
              icon={faMicrophone}
            />
          </i>
          <i
            title="Clear Conversation"
            className={showSpinner ? "disabled" : ""}
            onClick={clearConversation}
          >
            <FontAwesomeIcon
              style={{ color: "#133a84", height: 24, width: 24 }}
              icon={faCircleMinus}
            />
          </i>
        </>
      )}
      {recording && (
        <>
          <i title="Delete Recording" onClick={deleteRecording}>
            <FontAwesomeIcon
              style={{ color: "#d11a2a", height: 24, width: 24 }}
              icon={faTrash}
            />
          </i>
          <i title="Upload Recording" onClick={uploadAudio}>
            <FontAwesomeIcon
              style={{ color: "#133a84", height: 24, width: 24 }}
              icon={faCircleArrowUp}
            />
          </i>
        </>
      )}
    </div>
  );
};

export default AudioRecorder;
