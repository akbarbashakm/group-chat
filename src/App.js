import React, { useState, useEffect } from 'react';
import { ChatArea, Circle, Group, Groups, MsgBox, MsgInfo, MsgRoot, Root, Section } from './components';
import Modal from './components/Modal';
import Socket, { sendSocketMessage } from './socket';


const GROUPS = [{
  id: 'entertainment',
  name: 'Entertainment',
  img: 'https://i.imgur.com/7rg1hZH.jpg'
}, {
  id: 'sports',
  name: 'Sports',
  img: 'https://i.imgur.com/8jTMwZy.jpg'
}, {
  id: 'tech',
  name: 'Tech',
  img: 'https://i.imgur.com/E90WIZf.jpg'
}, {
  id: 'news',
  name: 'News',
  img: 'https://i.imgur.com/X2wGLBP.jpg'
}]


const App = () => {

  const [roomId, setRoomId] = useState('entertainment');
  const [name, setName] = useState(null);
  const [messages, setMessages] = useState([]);
  const [socketId, setSocketId] = useState('');
  const [currentMsg, setMsg] = useState('');

  useEffect(() => {
    setMessages([]);
    sendSocketMessage('changeRoom', {
      socketId,
      roomId
    })
    
  }, [roomId]);

  return (
    <Socket setId={(id) => {
      setSocketId(id)
    }} action={setMessages}>
      <Root>
        <Section flex="0.4">
          <Groups>
            {GROUPS.map(({ img, id, name }) => {
              return (
                <Group isSelected={roomId === id} key={id} onClick={() => {
                  setRoomId(id)
                }}>
                  <img src={img} alt="" />
                  <div>
                    <span>{name}</span>
                  </div>
                </Group>
              )
            })}
          </Groups>
        </Section>
        <Section isChat={true}>
          <div className='content'>
            {messages.map(({ name, msg, isSender = false, date }) => {
              const d = new Date(date);
              return (
                <MsgRoot isSender={isSender}>
                  <Circle>{name[0].toUpperCase()}</Circle>
                  <MsgBox>
                    <MsgInfo>
                      <div className="name">{name}</div>
                      <div className="time">{`${d.getHours()}:${d.getMinutes()}`}</div>
                    </MsgInfo>
                    <div class="msg-text">
                      {msg}
                    </div>
                  </MsgBox>
                </MsgRoot>
              )
            })}
          </div>
          <div>
            <ChatArea>
              <input value={currentMsg} type="text" placeholder="Enter your message..." onChange={(e) => {
                setMsg(e.target.value)
              }} />
              <button type="submit" onClick={(e) => {
                debugger
                e && e.preventDefault();
                setMessages([
                  ...messages,
                  {
                    name,
                    msg: currentMsg,
                    date: new Date(),
                    isSender: true
                  }
                ])
                sendSocketMessage('sendMessage', {
                  socketId,
                  roomId,
                  name,
                  msg: currentMsg,
                  date: new Date()
                })
                setMsg('');
              }} >Send</button>
            </ChatArea>
          </div>
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
