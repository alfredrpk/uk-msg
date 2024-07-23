import React from 'react';
import './Login.css';
import { auth, provider } from '../../firebase/config';

function Login() {
  const signIn = () => {
    auth.signInWithPopup(provider).catch((err) => alert(err));
  };
  return (
    <div className="login">
      <div className="login__logo">
        <p className="login__title">🇬🇧</p>
        <p className="login__title">the uk (fake)</p>
      </div>
      <button onClick={signIn}>Sign In</button>
    </div>
  );
}

export default Login;
