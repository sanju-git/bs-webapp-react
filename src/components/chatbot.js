import React, { useState } from 'react';
import SendArea from './sendArea';
import Tableau from './tableau';
import IronManArc from './ironManArc';
import BannerText from './bannerText';

const bannerTexts = [
    "Friday: Because Everyone Deserves Their Own Superhero Assistant",
    "Why Talk to Yourself When You Can Talk to Friday?",
    "Friday: The Assistant Tony Stark Would Be Jealous Of",
    "Introducing Friday: Making You Feel Like Tony Stark, One Chat at a Time",
    "Need a Genius Assistant? Just Ask Friday. Iron Suit Not Included.",
    "Friday: More Reliable Than Tony Stark Before His Morning Coffee",
    "Feeling Like a Billionaire Genius Yet? You Will with Friday!",
    "Friday: Turning Mundane Tasks into Superhero Feats",
    "Get Friday: Because Even Iron Man Needs a Break Sometimes",
    "Friday: Helping You Avoid Those 'Stark' Realizations"
];

const Chatbot = () => {

    const [messages, setMessages] = useState([]);
    const [showSpinner, setShowSpinner] = useState(false);
    const [reportURL, setReportURL] = useState('');
    const [showArcSpinner, setShowArcSpinner] = useState(false);

    const onSetShowArcSpinner = (show)=>{
        setShowArcSpinner(show);
    }

    const setAudioMessages = (messages, inputTranscript) => {
        setMessages(prevMessages => [...prevMessages, { text: inputTranscript, type: 'you' }]);
        messages.forEach(message => {
            if (message['content'].startsWith("{\"strResponse\":")) {
                let responseObject = JSON.parse(message['content']);
                let strResponse = responseObject.strResponse;
                if(strResponse && strResponse.length>=1){
                    setMessages(prevMessages => [...prevMessages, { text: strResponse, type: 'friend' }]);
                }
                let tableauURL = responseObject.tableauURL;
                if(tableauURL && tableauURL.length>=1){
                    setShowArcSpinner(true);
                    setReportURL(tableauURL);
                    setMessages(prevMessages => [...prevMessages, { text: "Report is being displayed on the side.", type: 'friend' }]);
                }
            } else {
                setMessages(prevMessages => [...prevMessages, { text: message['content'], type: 'friend' }]);
                setShowArcSpinner(false);
            }
        setShowSpinner(false);
            // setShowArcSpinner(false);
        })

        toggleSpinner(false);
    }

    const toggleSpinner = (show) => {
        setShowSpinner(show);
    }

    const sendMessage = async (inputText) => {
        if (inputText.trim() === '') return;
        setMessages(prevMessages => [...prevMessages, { text: inputText, type: 'you' }]);
        setShowSpinner(true);
        const requestBody = {
            text: inputText,
            sessionId: 290524,
        };
        setShowArcSpinner(true);
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
                // if (message['content'].startsWith("Here is the information you requested")) {
                //     const regex = /https:[^"]+/;
                //     const match = message['content'].match(regex);
                //     if (match) {
                //         setReportURL(match[0]);
                //         setMessages(prevMessages => [...prevMessages, { text: "Report is being displayed on the side.", type: 'friend' }]);
                //     }
                // }
                if (message['content'].startsWith("{\"strResponse\":")) {
                    let responseObject = JSON.parse(message['content']);
                    let strResponse = responseObject.strResponse;
                    if(strResponse && strResponse.length>=1){
                        setMessages(prevMessages => [...prevMessages, { text: strResponse, type: 'friend' }]);
                    }
                    let tableauURL = responseObject.tableauURL;
                    if(tableauURL && tableauURL.length>=1){
                        
                        setReportURL(tableauURL);
                        setMessages(prevMessages => [...prevMessages, { text: "Report is being displayed on the side.", type: 'friend' }]);
                    }
                }
                else {
                    setMessages(prevMessages => [...prevMessages, { text: message['content'], type: 'friend' }]);
                    setShowArcSpinner(false);
                }
                setShowSpinner(false);
            })   
        } catch (error) {
            console.error('Error:', error);
        }
    };



    return (
        <div className="container d-flex">
            <div className="app">
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
                                    <><br />
                                    <br />
                                    <br />
                                    <br />
                                    <div className="loader"></div></>
                                )}
                            </div>
                            <SendArea setAudioMessages={setAudioMessages} toggleSpinner={toggleSpinner} onSendMessage={sendMessage} />
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ width: '60%' }}>

                {((!reportURL || reportURL.length == 0) && (showArcSpinner)) && (
                    <IronManArc />
                ) }
                 {/* <IronManArc /> */}
                {((!reportURL || reportURL.length == 0) && (!showArcSpinner)) && (
                    <div className='d-flex align-items-center justify-content-center' style={{ height: '92vh' }}>
                        <div className='bannertext-wrapper'>
                            <BannerText />
                        </div>
                    </div>
                )}
                {(reportURL && reportURL.length >= 1) && (
                    <div style={{ width: '60%' }}>
                        <div>
                            <Tableau onSetShowArcSpinner = {onSetShowArcSpinner} iframeWidth="100%" iframeHeight="100vh" reportURL={reportURL} />
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default Chatbot;
