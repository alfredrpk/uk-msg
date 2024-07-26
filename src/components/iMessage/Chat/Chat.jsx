import React, { useEffect, useState, useRef } from 'react';
import './Chat.css';
import { IconButton } from '@material-ui/core';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';

import Message from './Message/Message';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../features/userSlice';
//import { selectChatId, selectChatName } from '../../../features/chatSlice';
import db from '../../../firebase/config';
import firebase from 'firebase';
import FlipMove from 'react-flip-move';
import { ReactComponent as UkFlag } from '../../../images/uk-flag.svg'

function Chat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [lastMessage,setLastMessage] = useState(false)
  const [nextPosts_loading, setNextPostsLoading] = useState(false);
  const [mostRecentMessageType, setMostRecentMessageType] = useState('new')
  const [containerStatus, setContainerStatus] = useState('asleep')
  const user = useSelector(selectUser);
  // const chatName = useSelector(selectChatName);
  const chatName = 'the uk' //hardcode this for now, just one chat
  // const chatId = useSelector(selectChatId);
  const chatId = 'chat_beta_1' //hardcode this for now, just one chat
  const lastMsgRef = useRef(null)
  const firstMsgRef = useRef(null)

  const updateContainerStatus = () => {
    fetch('https://alfredrpk--alive-dev.modal.run/')
        .then(response => response.json())
        .then(data => {
          if(data.num_total_runners === 0) {
            setContainerStatus('asleep')
          } else if(data.num_total_runners >= 1) {
            setContainerStatus('awake')
          } else if(data.backlog >= 1 ) {
            setContainerStatus('waking up')
          }
        });
  }

  const wakeContainer = () => {

    fetch('https://alfredrpk--wake-dev.modal.run/').then(setContainerStatus('waking up'))
  }
  
  const postRythmMessage = (input) => {

    db.collection('chats').doc(chatId).collection('messages').add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      uid: "rythmbot",
      photo: "https://i.imgur.com/HX3sVQE.png",
      email: "fake@email.com",
      displayName: "Rythm Bot",
    });
  }

  const getConversation = (ctx) => {
    postRythmMessage("Creating Conversation... Please wait a minute or two.")
    try {
      fetch('https://alfredrpk--uk-app-get-completion-dev.modal.run/?' + new URLSearchParams({
          context: ctx,
      }).toString()).then(response =>{
        if (!response.ok) {
          postRythmMessage("Conversation Failed! This is usually either due a timeout or some other internal error. Please try again.")
        } else {
          postRythmMessage("Conversation Complete! You can send a new message.")
        }
      })
    } catch {
      postRythmMessage("Conversation Failed! This is usually either due a timeout or some other internal error. Please try again.")
    }
  }

  const firstPosts = () => {
    try {
      db.collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('timestamp', 'desc').limit(50)
      .onSnapshot((snapshot) =>{
        const d = snapshot.docs.reverse()
        setMessages(
          d.map((doc) => ({ id: doc.id, data: doc.data() }))
        )
        setLastMessage(
          // throw error if d[0].data() is undefined
          d[0].data().timestamp
        )
        setMostRecentMessageType('new')
      }
        
      );
    } catch(e) {
      console.log(e)
    }
  }

  const nextPosts = (key) => {
    setNextPostsLoading(true);
    try {
      db.collection('chats')
        .doc(chatId)
        .collection('messages')
        .orderBy('timestamp', 'desc')
        .startAfter(key)
        .limit(25)
        .onSnapshot((snapshot) => {
          const newMsgs = snapshot.docs.reverse().map((doc) => ({ id: doc.id, data: doc.data() }))
          setMessages(
            [...newMsgs,...messages ]
            )
            setLastMessage(
              newMsgs[0].data.timestamp
            )
        }
        );
        setMostRecentMessageType('old')
        setNextPostsLoading(false);
    } catch (e) {
      console.log(e);
      setNextPostsLoading(false);
    }
  }
  
  useEffect(() => {
    if (chatId) {
      firstPosts();
      updateContainerStatus();
    }
  }, [chatId]);

  useEffect(() => {
    const interval = setInterval(() => {
      updateContainerStatus();
    }, 5000);
  
    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [])


  const scrollToBottom = () => {
    lastMsgRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  const scrollToTop = () => {
    firstMsgRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const Status = () => {
    if(containerStatus === 'awake') {
      return  (<div className='bot__status'>
        <p>bot status: <b>awake</b></p>
      </div>)
    } else if(containerStatus === 'asleep') {
      return(
        <div className='bot__status'>
      <p>bot status: <b>asleep. <p className='wakeup' onClick={() => {wakeContainer()}}>wake them up?</p></b></p>
      </div>
      )
    } else if(containerStatus === 'waking up') {
      return (<div className='bot__status'><p>bot status: <b>waking up</b>. May take up to 5 minutes</p></div>)
    }
  }

  const CurrentUser = () => {
    if (user.displayName.toLowerCase().includes(("Alfred").toLowerCase())){
        return (<div className='bot__status'><p>You are sending messages as: Alfred</p></div>)
    } else if (user.displayName.toLowerCase().includes(("Pranav").toLowerCase())){
        return (<div className='bot__status'><p>You are sending messages as: Pranav</p></div>)
    } else if (user.displayName.toLowerCase().includes(("Thomas").toLowerCase())){
        return (<div className='bot__status'><p>You are sending messages as: Thomas</p></div>)
    } else if (user.displayName.toLowerCase().includes(("Daniel").toLowerCase())){
        return (<div className='bot__status'><p>You are sending messages as: Daniel</p></div>)
    } else if (user.displayName.toLowerCase().includes(("Slam").toLowerCase())){
        return (<div className='bot__status'><p>You are sending messages as: Slam</p></div>)
    } else if (user.displayName.toLowerCase().includes(("Henrry").toLowerCase())){
        return (<div className='bot__status'><p>You are sending messages as: Henrry</p></div>)
    } else {
      return (<div className='bot__status'><p>YOUR CURRENT USER IS NOT RECOGNIZED, LET ALFRED KNOW</p></div>)
    }
  }

  useEffect(() => {
    if(mostRecentMessageType === 'new'){
      scrollToBottom()
    } else {
      scrollToTop()
    }
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    let actual_user = "nan";
    if (user.displayName.toLowerCase().includes(("Alfred").toLowerCase())){
      actual_user = "Alfred"
    } else if (user.displayName.toLowerCase().includes(("Pranav").toLowerCase())){
      actual_user = "Pranav"
    } else if (user.displayName.toLowerCase().includes(("Thomas").toLowerCase())){
      actual_user = "Thomas"
    } else if (user.displayName.toLowerCase().includes(("Daniel").toLowerCase())){
      actual_user = "Daniel"
    } else if (user.displayName.toLowerCase().includes(("Slam").toLowerCase())){
      actual_user = "Slam"
    } else if (user.displayName.toLowerCase().includes(("Henrry").toLowerCase()) || user.displayName.toLowerCase().includes(("Henry").toLowerCase())){
      actual_user = "Henrry"
    } 
    console.log(actual_user);
    if (actual_user != "nan") {
      db.collection('chats').doc(chatId).collection('messages').add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: input,
        uid: user.uid,
        photo: user.photo,
        email: user.email,
        displayName: actual_user,
      });
      setInput('');
      console.log(user.displayName);
      getConversation(actual_user +": "+input);
    } else {
      setInput('');
      postRythmMessage("Your user is not recognized. Your name likely doesn't match. Ask Alfred to fix this.");
    }
    return false
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <div className="header__icon">
          <UkFlag className="emojichat" />
        <p>
          {chatName}
        </p>
        <Status />
        <CurrentUser />
        </div>
       
      </div>

      {/* Chat  messages */}
      <div className="chat__messages">
      <div className='chat__loading'  ref={firstMsgRef}>
        {nextPosts_loading ? (
          <p>Loading..</p>
        ) : lastMessage ? (
          <button className='chat__more_button' onClick={() => nextPosts(lastMessage)}>Load older messages</button>
        ) : (
          <span>No more messages</span>
        )}
      </div>
        <FlipMove>
          {messages.map(({ id, data }) => (
            <Message key={id} id={id} contents={data} />
          ))}
        </FlipMove>
        <div ref={lastMsgRef} />
      </div>

      {/* Chat  input*/}
      <div className="chat__input">
        <form method="POST" onSubmit={(e) => sendMessage(e)}>
          <input
            type="text"
            placeholder="Message #question-time"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </form>
        <div className='send__button'>
        <IconButton size="small" color="primary" onClick={sendMessage}>
          <ArrowCircleUpIcon />
        </IconButton>
        </div>
      </div>
    </div>
  );
}

export default Chat;
