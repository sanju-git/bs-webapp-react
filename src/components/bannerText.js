import React, { useEffect, useState } from 'react';
import './consoleText.css'; // Create a separate CSS file for the styles

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

const BannerText = () => {
    const getRandomText = () => {
        const randomIndex = Math.floor(Math.random() * bannerTexts.length);
        return bannerTexts[randomIndex];
    };

    const [bannerText, setBannerText] = useState(getRandomText);

    useEffect(() => {
        setBannerText(getRandomText());
    }, []);

    return (
        <div style={{ maxWidth: 900 }} className="typewriter d-flex">
            <h2>{bannerText}</h2>
        </div>
    );
};

export default BannerText;
