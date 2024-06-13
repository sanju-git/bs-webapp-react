import React, { useState } from 'react';
import SendArea from './sendArea';
import Tableau from './tableau';

const Chatbot = () => {

    const [messages, setMessages] = useState([]);
    const [showSpinner, setShowSpinner] = useState(false);
    const [reportURL, setReportURL] = useState('');

    const sendMessage = async (inputText) => {
        if (inputText.trim() === '') return;
        setMessages(prevMessages => [...prevMessages, { text: inputText, type: 'you' }]);
        setShowSpinner(true);
        const requestBody = {
            text: inputText,
            sessionId: 290524,
        };

        try {
            const res = await fetch('http://localhost:8080/lex', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const data = await res.json();
            data['messages'].forEach(message => {
                if (message['content'].startsWith("Here is the information you requested")) {
                    const regex = /https:[^"]+/;
                    const match = message['content'].match(regex);
                    if (match) {
                        setReportURL(match[0]);
                        setMessages(prevMessages => [...prevMessages, { text: "Report is being displayed on the side.", type: 'friend' }]);
                    }
                } else {
                    setMessages(prevMessages => [...prevMessages, { text: message['content'], type: 'friend' }]);
                }
            })
            setShowSpinner(false);
        } catch (error) {
            console.error('Error:', error);
        }
    };



    return (
        <div className="container d-flex">
            <div className="app">
                {/* <div className="d-flex align-items-center justify-content-center head clearfix">
                    <div className="friday">
                        <h2>F.R.I.D.A.Y</h2>
                    </div>
                    <div className="friday">
                        <h4 style={{ marginLeft: 10, marginRight: 10 }}>X</h4>
                    </div>
                    <div>
                        <img className='logo' src='/images/bs.png' alt="logo" />
                    </div>
                </div> */}
                
                <div className="body wrapper">
                    <div className="chat-messages">
                        <div className="chat">
                            <div className="chat-content clearfix">
                                {messages.map((message, index) => (
                                    <div key={index}>
                                        <span className={message.type}>
                                            {message.text}
                                        </span>
                                        <br />
                                    </div>
                                ))}
                                {showSpinner && (
                                    <div><br /><div className="loader"></div></div>
                                )}
                            </div>
                            <SendArea onSendMessage={sendMessage} />
                        </div>
                    </div>
                </div>
            </div>
            {(reportURL && reportURL.length >= 1) && (
                <div style={{ width: '60%' }}>
                    <div>
                        <Tableau iframeWidth="100%" iframeHeight="100vh" reportURL={reportURL} />
                    </div>
                    {/* 
            <tableau-viz id="tableauViz"
                src='https://public.tableau.com/app/profile/aarthe.radhakrishnan/viz/TopNProducts_17168006299450/TopNproductsbySalesVolume?publish=yes'>
            </tableau-viz> */}
                </div>
            )}

        </div>
    );
};

export default Chatbot;
