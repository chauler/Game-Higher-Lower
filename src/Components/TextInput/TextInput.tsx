"use client";
import { useState } from "react";

export default function TextInput() {
  function updateGame(appid: number) {
    setInputText(appid.toString());
    setAppid(appid);
  }

  const [appid, setAppid] = useState(730);
  const [inputText, setInputText] = useState(appid.toString());

  return (
    <input
      value={inputText}
      onChange={(e) => {
        if (e.target.value === "") {
          setInputText("");
          return;
        }
        let value = parseInt(e.target.value);
        Number.isNaN(value) ? 0 : updateGame(value);
      }}
    ></input>
  );
}
