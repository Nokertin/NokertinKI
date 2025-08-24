import { useEffect, useRef, useState } from 'react';

export default function Home(){
  const [chats, setChats] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [files, setFiles] = useState([]);
  const endRef = useRef();

  useEffect(()=>{ loadChats(); }, []);

  async function loadChats(){
    const res = await fetch('/api/chats');
    const data = await res.json();
    setChats(data);
    if(data.length && !active) {
      setActive(data[0]._id);
      loadMessages(data[0]._id);
    }
  }

  async function createChat(){
    const res = await fetch('/api/chats', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ title: 'Новый чат' }) });
    const j = await res.json();
    setChats(prev=>[j,...prev]);
    setActive(j._id);
    setMessages([]);
  }

  async function loadMessages(chatId){
    const res = await fetch('/api/chats/' + chatId);
    const j = await res.json();
    setMessages(j.messages || []);
    setTimeout(()=> endRef.current?.scrollIntoView({behavior:'smooth'}),100);
  }

  async function send(){
    if(!active) return alert('выбери чат');
    if(!text.trim() && files.length===0) return;
    const form = new FormData();
    form.append('chatId', active);
    form.append('text', text);
    for(const f of files) form.append('files', f);
    setText('');
    setFiles([]);
    const res = await fetch('/api/messages', { method:'POST', body: form });
    const j = await res.json();
    loadMessages(active);
  }

  function onFile(e){
    const arr = Array.from(e.target.files || []);
    setFiles(arr);
  }

  return (
    <div className='container'>
      <div className='sidebar'>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <h3>AI Chat</h3>
          <button onClick={createChat} style={{background:'#4f46e5',borderRadius:8,padding:'6px 8px',border:'none'}}>Новый</button>
        </div>
        <ul className='chat-list'>
          {chats.map(c=>(
            <li key={c._id} className={'chat-item ' + (c._id===active? 'active':'')} onClick={()=>{ setActive(c._id); loadMessages(c._id); }}>
              <div style={{fontSize:14}}>{c.title}</div>
              <div style={{fontSize:12,color:'#94a3b8'}}>{new Date(c.updatedAt).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </div>

      <div className='chat'>
        <div className='header'>
          <strong>{chats.find(x=>x._id===active)?.title || 'Чат'}</strong>
        </div>

        <div className='messages'>
          {messages.map((m,i)=>(
            <div key={i} style={{display:'flex',flexDirection:'column',alignItems: m.role==='user'? 'flex-end':'flex-start'}}>
              <div className={'msg ' + (m.role==='user'? 'user':'assistant')}>
                {m.text && <div style={{whiteSpace:'pre-wrap'}}>{m.text}</div>}
                {m.images && m.images.length>0 && (
                  <div className='upload-preview' style={{display:'flex',marginTop:8}}>
                    {m.images.map((src,idx)=>(<img key={idx} src={src} alt='img'/>))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div className='inputArea'>
          <input value={text} onChange={e=>setText(e.target.value)} placeholder='Спроси что-нибудь...' style={{flex:1,padding:10,borderRadius:8,background:'#061226',border:'1px solid #102030',color:'#e6eef8'}} onKeyDown={(e)=>{ if(e.key==='Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} />
          <input type='file' accept='image/*' multiple onChange={onFile} capture='environment' />
          <button onClick={send} style={{background:'#4f46e5',color:'#fff',padding:'10px 14px',borderRadius:8,border:'none'}}>Отправить</button>
        </div>
      </div>
    </div>
  )
}
