import React, { useEffect, useState } from "react";
import "./consoleText.css"; // Assuming you have styles for the typewriter effect

const bannerTexts = [
  "Friday: Because Everyone Deserves Their Own Superhero Assistant",
  "Why Talk to Yourself When You Can Talk to Friday?",
  "Friday: The Assistant Tony Stark Would Be Jealous Of",
  "Friday: Making You Feel Like Tony Stark, One Chat at a Time",
  "Need a Genius Assistant? Just Ask Friday. Iron Suit Not Included.",
  "Friday: More Reliable Than Tony Stark Before His Morning Coffee",
  "Feeling Like a Billionaire Genius Yet? You Will with Friday!",
  "Friday: Turning Mundane Tasks into Superhero Feats",
  "Get Friday: Because Even Iron Man Needs a Break Sometimes",
  "Friday: Helping You Avoid Those 'Stark' Realizations",
];

const japaneseBannerTexts = [
  "Friday: 誰もが自分のスーパーヒーローアシスタントを持つべきですから",
  "自分と話すよりも、Friday と話してみませんか？",
  "Friday: トニー・スタークが嫉妬するアシスタント",
  "Friday: トニー・スタークになった気分に、一回のチャットで",
  "天才アシスタントが必要ですか？ただ Friday に聞いてください。アイアンスーツは含まれていません。",
  "Friday: トニー・スタークの朝のコーヒーよりも頼りになる",
  "億万長者の天才になった気分？Friday でそうなります！",
  "Friday: 日常のタスクをスーパーヒーローの偉業に変える",
  "Friday をゲット：アイアンマンだって休憩が必要な時があります",
  "Friday: あなたがその「スターク」な気付きから逃れる手助けを",
];

const BannerText = (props) => {
  const { language = "English" } = props;

  // Function to get random text
  const getRandomText = () => {
    let textArray = [];
    if (language === "English" || language === "" ) {
      textArray = bannerTexts; // Fix: Use the correct variable name 'bannerTexts'
    } else if (language === "日本語") {
      textArray = japaneseBannerTexts;
    }

    const randomIndex = Math.floor(Math.random() * textArray.length);
    return textArray[randomIndex];
  };

  // State for banner text
  const [bannerText, setBannerText] = useState(getRandomText);

  // Update banner text on component mount and when language changes
  useEffect(() => {
    setBannerText(getRandomText());
  }, [language]); // Fix: Include 'language' in the dependency array to update when it changes

  return (
    <div style={{ maxWidth: 900 }} className="typewriter d-flex">
      <h2>{bannerText}</h2>
    </div>
  );
};

export default BannerText;
