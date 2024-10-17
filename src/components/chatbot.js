import React, { useState, useEffect, useRef } from "react";
import SendArea from "./sendArea";
import Tableau from "./tableau";
import IronManArc from "./ironManArc";
import BannerText from "./bannerText";
import { v4 as uuidv4 } from "uuid";
import Modal from "./Modal";
import { NODE_URL } from "../constants/apiConstants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const [reportURL, setReportURL] = useState("");
  const [language, setLanguage] = useState("");
  const [isChatCollapsed, setChatCollpase] = useState(false);
  const [showArcSpinner, setShowArcSpinner] = useState(false);
  const [showClearConfirmationModal, setClearConfirmationModal] =
    useState(false);
  const [floatRight, setFloatRight] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const chatContentRef = useRef(null);
  const languageOptions = ["English", "日本語"];

  const handleChange = (option) => {
    setLanguage(option); // Set selected option
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        text: option,
        type: "you",
      },
      {
        text:
          option === "English"
            ? "You can proceed your conversation in English"
            : "日本語で会話を進めることができます",
        type: "friend",
      },
    ]);
  };

  useEffect(() => {
    // Generating a new GUID when the component is first rendered
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
  }, []);

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [messages]);

  const onSetShowArcSpinner = (show) => {
    setShowArcSpinner(show);
  };

  const clearConversation = () => {
    setClearConfirmationModal(!showClearConfirmationModal);
  };

  const showChat = () => {
    setChatCollpase(!isChatCollapsed)
  }

  const deleteConversations = (option) => {
    if (option) {
      setInitialState();
    }
    clearConversation();
  };

  const setInitialState = () => {
    setMessages([]);
    setReportURL("");
    setLanguage("");
    setSessionId("");
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
  };

  const setAudioMessages = (
    isError,
    messages,
    inputTranscript,
    reportURLResponse
  ) => {
    if (!isError) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: inputTranscript, type: "you" },
      ]);
      messages.forEach((message) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: message["content"], type: "friend" },
        ]);
        setShowSpinner(false);
      });

      if (reportURLResponse && reportURLResponse.length >= 1) {
        setReportURL(reportURLResponse);
      } else {
        setReportURL("");
      }
    } else {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "Server is busy at the moment. Please try again in some time",
          type: "friend",
        },
      ]);
    }
  };

  const toggleSpinner = (show, from) => {
    setShowSpinner(show);
    if (from && from === "audioPrompt") {
      setFloatRight(show);
    }
  };

  const sendMessage = async (inputText) => {
    if (inputText.trim() === "") return;
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: inputText, type: "you" },
    ]);
    setShowSpinner(true);
    const requestBody = {
      text: inputText,
      sessionId: sessionId,
      language,
    };
    setShowArcSpinner(true);
    try {
      const res = await fetch(NODE_URL + "lex", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      const data = await res.json();
      setShowArcSpinner(false);
      setShowSpinner(false);
      data["messages"].forEach((message) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: message["content"], type: "friend" },
        ]);
      });

      let reportURLResponse =
        data["sessionState"]["sessionAttributes"]["TableauURL"] || "";
      if (reportURLResponse && reportURLResponse.length >= 1) {
        setReportURL(reportURLResponse);
      } else {
        setReportURL("");
      }
    } catch (error) {
      console.error("Error:", error);
      setShowArcSpinner(false);
      setShowSpinner(false);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "Server is busy at the moment. Please try again in some time",
          type: "friend",
        },
      ]);
    }
  };

  return (
    <div className="container d-flex">
      <div className={`app ${isChatCollapsed ? "collapsed" : ""}`}>
        <div className="body wrapper">
          <div className="chat-messages">
            <div className="chat">
              <div className="chat-content clearfix" ref={chatContentRef}>
                <>
                  <span className="friend">Pick a language to proceed</span>
                  <br />
                  <span className="friend">言語を選択して続行してください</span>
                  <br />
                  <div className="d-flex">
                    {languageOptions.map((option) => (
                      <span
                        onClick={() => handleChange(option)}
                        className={
                          language.length >= 1
                            ? "disabled language-option mx-1"
                            : "language-option mx-1"
                        }
                      >
                        {option}
                      </span>
                    ))}
                  </div>
                </>
                {/* )} */}
                {messages.map((message, index) => (
                  <div key={index}>
                    <span className={message.type}>{message.text}</span>
                    <br />
                  </div>
                ))}
                {showSpinner && (
                  <>
                    <br />
                    <br />
                    <div
                      style={{ float: floatRight ? "right" : "left" }}
                      className="loader"
                    ></div>
                  </>
                )}
              </div>
              {language && language.length != 0 && (
                <SendArea
                  showSpinner={showSpinner}
                  onSetShowArcSpinner={onSetShowArcSpinner}
                  setAudioMessages={setAudioMessages}
                  toggleSpinner={toggleSpinner}
                  onSendMessage={sendMessage}
                  sessionId={sessionId}
                  language={language}
                  clearConversation={clearConversation}
                />
              )}
            </div>
          </div>
        </div>
        {!isChatCollapsed && (<div className="toggleLeft">
          <FontAwesomeIcon
            style={{ color: "#f2f2f2", height: 24, width: 24 }}
            icon={faCircleChevronLeft}
            onClick={() => {
              setChatCollpase(!isChatCollapsed);
            }}
          />
        </div>)}
      </div>
      <div className="report-view">
        {(!reportURL || reportURL.length === 0) && showArcSpinner && (
          <IronManArc />
        )}
        {(!reportURL || reportURL.length === 0) && !showArcSpinner && (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ height: "90vh" }}
          >
            <div className="bannertext-wrapper">
              <BannerText language={language} />
            </div>
          </div>
        )}
        {reportURL && reportURL.length >= 1 && (
          <div>
            <Tableau
              onSetShowArcSpinner={onSetShowArcSpinner}
              iframeWidth="100%"
              iframeHeight="100vh"
              reportURL={reportURL}
              showChat={showChat}
              isChatCollapsed={isChatCollapsed}
            />
          </div>
        )}
      </div>
      {showClearConfirmationModal && (
        <Modal
          clearConversation={clearConversation}
          deleteConversations={deleteConversations}
        />
      )}
    </div>
  );
};

export default Chatbot;
