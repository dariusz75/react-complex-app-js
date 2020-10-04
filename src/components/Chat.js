import React, { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useImmer } from "use-immer";
import io from "socket.io-client";

import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";

const socket = io(
  process.env.BACKENDURL || "https://backend-for-react-post-app.herokuapp.com"
);

function Chat() {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  const chatField = useRef(null);
  const chat = useRef(null);
  const initialState = {
    chatInputValue: "",
    chatMessages: [],
  };
  const [state, setState] = useImmer(initialState);

  useEffect(() => {
    if (appState.isChatOpen) {
      chatField.current.focus();
      appDispatch({ type: "clearUnreadChatCount" });
    }
  }, [appState.isChatOpen]);

  useEffect(() => {
    socket.on("chatFromServer", (message) => {
      setState((draft) => {
        draft.chatMessages.push(message);
      });
    });
  }, []);

  useEffect(() => {
    chat.current.scrollTop = chat.current.scrollHeight;
    if (state.chatMessages.length > 0 && !appState.isChatOpen) {
      appDispatch({ type: "incrementUnreadChatCount" });
    }
  }, [state.chatMessages]);

  const closeChat = () => {
    appDispatch({ type: "closeChat" });
  };

  const handleChatInput = (e) => {
    const value = e.target.value;
    setState((draft) => {
      draft.chatInputValue = value;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send message to chat server
    socket.emit("chatFromBrowser", {
      message: state.chatInputValue,
      token: appState.user.token,
    });

    setState((draft) => {
      draft.chatMessages.push({
        message: state.chatInputValue,
        username: appState.user.username,
        avatar: appState.user.avatar,
      });
      draft.chatInputValue = "";
    });
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
      <div id="chat" className="chat-log" ref={chat}>
        {state.chatMessages.map((message, index) => {
          if (message.username === appState.user.username) {
            return (
              <div key={index} className="chat-self">
                <div className="chat-message">
                  <div className="chat-message-inner">{message.message}</div>
                </div>
                <img
                  alt=""
                  className="chat-avatar avatar-tiny"
                  src={message.avatar}
                />
              </div>
            );
          }
          return (
            <div key={index} className="chat-other">
              <Link to={`profile/${message.username}`}>
                <img alt="" className="avatar-tiny" src={message.avatar} />
              </Link>
              <div className="chat-message">
                <div className="chat-message-inner">
                  <Link to={`profile/${message.username}`}>
                    <strong>{message.username}: </strong>
                    <br></br>
                  </Link>
                  {message.message}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <form
        id="chatForm"
        className="chat-form border-top"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="chat-field"
          id="chatField"
          placeholder="Type a message…"
          autoComplete="off"
          ref={chatField}
          value={state.chatInputValue}
          onChange={handleChatInput}
        />
      </form>
    </div>
  );
}

export default Chat;
