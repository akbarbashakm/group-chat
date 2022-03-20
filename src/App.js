import React, { useState, useEffect } from 'react';
import ChatBox from './components/ChatBox';
import { Root, Section } from './components';
import Modal from './components/Modal';
import GroupsPanel from './components/GroupsPanel';
import Messages from './components/Messages';
import Socket, { sendSocketMessage } from './socket';


const App = () => {
  const [roomId, setRoomId] = useState('entertainment');
  const [name, setName] = useState(null);
  const [messages, setMessages] = useState([]);
  const [socketId, setSocketId] = useState('');

  useEffect(() => {
    setMessages([]);
    sendSocketMessage('changeRoom', {
      socketId,
      roomId
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  return (
    <Socket setId={(id) => {
      setSocketId(id)
    }} action={setMessages}>
      <Root>
        <Section flex="0.4">
          <GroupsPanel roomId={roomId} setRoomId={setRoomId} />
        </Section>
        <Section isChat={true}>
          <Messages messages={messages} />
          <ChatBox action={(arg) => {
            setMessages([...messages, { name, ...arg, isSender: true }])
            sendSocketMessage('sendMessage', { socketId, roomId, name, ...arg })
          }} />
        </Section>
      </Root>
      {!name ? <Modal setName={(val) => {
        setName(val);
        sendSocketMessage('addUser', {
          socketId,
          roomId
        })
      }} /> : null}
    </Socket>
  )
}

export default App;
