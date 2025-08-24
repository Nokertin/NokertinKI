import { useState } from 'react';

export default function Login() {
  const [login, setLogin] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (login === 'admin' && pass === 'admin') {
      document.cookie = 'auth=1; path=/';
      // Добавляем задержку в 100 миллисекунд перед перенаправлением
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    } else {
      setErr('Неверный логин или пароль');
    }
  }

  return (
    <div style={{display:'flex',height:'100vh',alignItems:'center',justifyContent:'center',background:'#0b1020'}}>
      <form onSubmit={submit} style={{background:'#071022',padding:24,borderRadius:12,width:360}}>
        <h2 style={{margin:0,marginBottom:12}}>Вход</h2>
        {err && <div style={{color:'#ff7b7b',marginBottom:8}}>{err}</div>}
        <input placeholder='Логин' value={login} onChange={e=>setLogin(e.target.value)} style={{width:'100%',padding:8,marginBottom:8,borderRadius:6,background:'#0f1724',border:'1px solid #0b1220',color:'#e6eef8'}} />
        <input type='password' placeholder='Пароль' value={pass} onChange={e=>setPass(e.target.value)} style={{width:'100%',padding:8,marginBottom:8,borderRadius:6,background:'#0f1724',border:'1px solid #0b1220',color:'#e6eef8'}} />
        <button style={{width:'100%',padding:10,background:'#4f46e5',color:'white',borderRadius:8,border:'none'}}>Войти</button>
      </form>
    </div>
  )
}