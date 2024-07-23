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

function Chat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [lastMessage,setLastMessage] = useState(false)
  const [nextPosts_loading, setNextPostsLoading] = useState(false);
  const [mostRecentMessageType, setMostRecentMessageType] = useState('new')
  const [containerStatus, setContainerStatus] = useState('asleep')
  const [conversationStatus, setConversationStatus] = useState(false)
  const user = useSelector(selectUser);
  // const chatName = useSelector(selectChatName);
  const chatName = 'the uk' //hardcode this for now, just one chat
  // const chatId = useSelector(selectChatId);
  const chatId = 'rHGTegWba1tDsNvZ6yc1' //hardcode this for now, just one chat
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

  const getConversation = (ctx) => {
    console.log({ctx});
    setConversationStatus(true)
    //fetch('https://alfredrpk--uk-app-get-completion-dev.modal.run/?context=' + {ctx})
    //fetch('https://alfredrpk--uk-app-get-completion-dev.modal.run/?context=Me when big chungus theme song comes on at the reddit convention')
    fetch('https://alfredrpk--uk-app-get-completion-dev.modal.run/?' + new URLSearchParams({
        context: ctx,
    }).toString()).then(setConversationStatus(false))
    console.log("did we get here 4");
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

  const ConvoStatus = () => {
    if(conversationStatus === true) {
      return  (<div className='convo__status'>
        <p>convo status: <b>Creating a conversation... Please wait</b></p>
      </div>)
    } else {
      return (<div className='convo__status'>
      <p>convo status: <b>Free to create conversation</b></p>
    </div>)
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
    db.collection('chats').doc(chatId).collection('messages').add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      uid: user.uid,
      photo: user.photo,
      email: user.email,
      displayName: user.displayName,
    });
    setInput('');
    console.log(user.displayName);
    if (user.displayName.toLowerCase().includes(("Alfred").toLowerCase())){
      console.log("did we get here 1");
      getConversation("Alfred: "+input);
    } else if (user.displayName.toLowerCase().includes(("Pranav").toLowerCase())){
      getConversation("Pranav: "+input);
    } else if (user.displayName.toLowerCase().includes(("Thomas").toLowerCase())){
      getConversation("Thomas: "+input);
    } else if (user.displayName.toLowerCase().includes(("Daniel").toLowerCase())){
      getConversation("Daniel: "+input);
    } else if (user.displayName.toLowerCase().includes(("Eslam").toLowerCase())){
      getConversation("Slam: "+input);
    } else if (user.displayName.toLowerCase().includes(("Henrry").toLowerCase())){
      getConversation("Henry: "+input);
    } else {
      console.log("PERSON NOT FOUND, RESORTING TO DEFAULT")
      getConversation("Alfred: "+input);
    }
    console.log("did we get here 2");
    return false
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <div className="header__icon">
          <p>🇬🇧</p>
        <p>
          {chatName}
        </p>
        <Status />
        <ConvoStatus />
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
            placeholder="iMessage"
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
