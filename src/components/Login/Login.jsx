import React, { useState } from 'react';
import './Login.css';
import { auth, provider } from '../../firebase/config';
import { ReactComponent as UkFlag } from '../../images/uk-flag.svg';

const premadeUsers = [
  { uid: 'fake-alfred', displayName: 'Alfred', email: 'fake2@email.com', photoURL: 'https://i.imgur.com/a3mDeHY.png' },
  { uid: 'fake-pranav', displayName: 'Pranav', email: 'fake2@email.com', photoURL: 'https://i.imgur.com/K5mKyGs.png' },
  { uid: 'fake-slam', displayName: 'Slam', email: 'fake2@email.com', photoURL: 'https://i.imgur.com/03iMQYQ.png' },
  { uid: 'fake-henrry', displayName: 'Henrry', email: 'fake2@email.com', photoURL: 'https://i.imgur.com/IKkT93y.png' },
  { uid: 'fake-thomas', displayName: 'Thomas', email: 'fake2@email.com', photoURL: 'https://i.imgur.com/x1jZE5c.png' },
  { uid: 'fake-daniel', displayName: 'Daniel', email: 'fake2@email.com', photoURL: 'https://i.imgur.com/eTCgPrm.png' },
];


function Login({ onUserSelect }) {
  const [selectedUser, setSelectedUser] = useState(null);

  const signIn = () => {
    auth.signInWithPopup(provider).catch((err) => alert(err));
  };

  const handleUserSelect = (event) => {
    const selectedUser = premadeUsers.find(user => user.uid === event.target.value);
    setSelectedUser(selectedUser);
    if (selectedUser) {
      onUserSelect(selectedUser);
    }
  };

  return (
    <div className="login">
      <div className="login__logo">
        <UkFlag className="emoji" />
        <p className="login__title">the uk (fake)</p>
      </div>
      <button onClick={signIn}>Sign In</button>
      <p className="or">or choose your user:</p>
      <div class="dropdown-container">
      <select class="discord-select" onChange={handleUserSelect}>
        <option value="">Select User</option>
        {premadeUsers.map((user) => (
          <option key={user.uid} value={user.uid}>
            {user.displayName}
          </option>
        ))}
      </select>
      </div>
    </div>
  );
}

export default Login;
