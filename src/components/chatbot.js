import React, { useState, useEffect, useRef } from 'react';
import SendArea from './sendArea';
import Tableau from './tableau';
import IronManArc from './ironManArc';
import BannerText from './bannerText';
import { v4 as uuidv4 } from 'uuid';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [showSpinner, setShowSpinner] = useState(false);
    const [reportURL, setReportURL] = useState('');
    const [showArcSpinner, setShowArcSpinner] = useState(false);
    const [floatRight, setFloatRight] = useState(false);
    const [sessionId, setSessionId] = useState('');
    const chatContentRef = useRef(null);

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

    const setAudioMessages = (isError, messages, inputTranscript, reportURLResponse) => {
        if (!isError) {
            setMessages(prevMessages => [...prevMessages, { text: inputTranscript, type: 'you' }]);
            messages.forEach(message => {
                setMessages(prevMessages => [...prevMessages, { text: message['content'], type: 'friend' }]);
                setShowSpinner(false);
            });

            if (reportURLResponse && reportURLResponse.length >= 1) {
                setReportURL(reportURLResponse);
            } else {
                setReportURL('');
            }
        } else {
            setMessages(prevMessages => [...prevMessages, { text: 'Server is busy at the moment. Please try again in some time', type: 'friend' }]);
        }
    };

    const toggleSpinner = (show, from) => {
        setShowSpinner(show);
        if (from && from === 'audioPrompt') {
            setFloatRight(show);
        }
    };

    const sendMessage = async (inputText) => {
        if (inputText.trim() === '') return;
        setMessages(prevMessages => [...prevMessages, { text: inputText, type: 'you' }]);
        setShowSpinner(true);
        const requestBody = {
            text: inputText,
            sessionId: sessionId,
        };
        setShowArcSpinner(true);
        try {
            const res = await fetch('https://friday.internal.dev.apps.bsci.com/lex', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
            const data = await res.json();
            setShowArcSpinner(false);
            setShowSpinner(false);
            data['messages'].forEach(message => {
                setMessages(prevMessages => [...prevMessages, { text: message['content'], type: 'friend' }]);
            });

            let reportURLResponse = data['sessionState']['sessionAttributes']['TableauURL'] || '';
            if (reportURLResponse && reportURLResponse.length >= 1) {
                setReportURL(reportURLResponse);
            } else {
                setReportURL('');
            }
        } catch (error) {
            console.error('Error:', error);
            setShowArcSpinner(false);
            setShowSpinner(false);
            setMessages(prevMessages => [...prevMessages, { text: 'Server is busy at the moment. Please try again in some time', type: 'friend' }]);
        }
    };

    return (
        <div className="container d-flex">
            <div className="app">
                <div className="body wrapper">
                    <div className="chat-messages">
                        <div className="chat">
                            <div className="chat-content clearfix" ref={chatContentRef}>
                                {messages.map((message, index) => (
                                    <div key={index}>
                                        <span className={message.type}>
                                            {message.text}
                                        </span>
                                        <br />
                                    </div>
                                ))}
                                {showSpinner && (
                                    <>
                                        <br />
                                        <br />
                                        <div style={{ float: floatRight ? 'right' : 'left' }} className="loader"></div>
                                    </>
                                )}
                            </div>
                            <SendArea showSpinner={showSpinner} onSetShowArcSpinner={onSetShowArcSpinner} setAudioMessages={setAudioMessages} toggleSpinner={toggleSpinner} onSendMessage={sendMessage} sessionId={sessionId} />
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ width: '60%', height: '90vh' }}>
                {((!reportURL || reportURL.length === 0) && showArcSpinner) && (
                    <IronManArc />
                )}
                {((!reportURL || reportURL.length === 0) && !showArcSpinner) && (
                    <div className='d-flex align-items-center justify-content-center' style={{ height: '90vh' }}>
                        <div className='bannertext-wrapper'>
                            <BannerText />
                        </div>
                    </div>
                )}
                {(reportURL && reportURL.length >= 1) && (
                    <div style={{ width: '60%' }}>
                        <div>
                            <Tableau onSetShowArcSpinner={onSetShowArcSpinner} iframeWidth="100%" iframeHeight="100vh" reportURL={reportURL} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chatbot;