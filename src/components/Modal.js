import React, { useState, useEffect } from "react";

const Modal = ({ setOption, deleteConversations }) => {
  // Handle select change
  const handleChange = (option) => {
    deleteConversations(option); // Set selected option
  };

  return (
    <>
      <div className="darkBG" />
      <div className="centered">
        <div className="modal">
          <div className="modalHeader">
            <h6 onClick={() => handleChange(false)} className="close-icon">X</h6>
          </div>
          <div className="modalContent text-center">
            <h4>Are you sure you want to clear the conversation?</h4>
          </div>
          <div className="mt-2 text-center">
            <button
              className="red-hover-button"
              onClick={() => handleChange(true)}
            >
              Yes
            </button>
            <button
              className="grey-hover-button ml-1"
              onClick={() => handleChange(false)}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
