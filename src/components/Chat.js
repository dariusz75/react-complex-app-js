import React, { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";

function Chat() {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  const chatField = useRef(null);

  useEffect(() => {
    if (appState.isChatOpen) {
      chatField.current.focus();
    }
  }, [appState.isChatOpen]);

  const closeChat = () => {
    appDispatch({ type: "closeChat" });
  };

  return (
    <div
      id="chat-wrapper"
      className={
        "chat-wrapper shadow border-top border-left border-right " +
        (appState.isChatOpen ? " chat-wrapper--is-visible" : " ")
      }
    >
      <div className="chat-title-bar bg-primary">
        Chat
        <span className="chat-title-bar-close" onClick={closeChat}>
          <i className="fas fa-times-circle"></i>
        </span>
      </div>
      <div id="chat" className="chat-log">
        <div className="chat-self">
          <div className="chat-message">
            <div className="chat-message-inner">Hey, how are you?</div>
          </div>
          <img
            alt=""
            className="chat-avatar avatar-tiny"
            src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128"
          />
        </div>

        <div className="chat-other">
          <Link to="#">
            <img
              alt=""
              className="avatar-tiny"
              src="https://gravatar.com/avatar/b9216295c1e3931655bae6574ac0e4c2?s=128"
            />
          </Link>
          <div className="chat-message">
            <div className="chat-message-inner">
              <Link to="#">
                <strong>barksalot:</strong>
              </Link>
              Hey, I am good, how about you?
            </div>
          </div>
        </div>
      </div>
      <form id="chatForm" className="chat-form border-top">
        <input
          type="text"
          className="chat-field"
          id="chatField"
          placeholder="Type a message…"
          autoComplete="off"
          ref={chatField}
        />
      </form>
    </div>
  );
}

export default Chat;
