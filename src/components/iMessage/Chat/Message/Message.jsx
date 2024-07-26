import React, { forwardRef } from 'react';
import './Message.css';
import { Avatar } from '@material-ui/core';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../../features/userSlice';

const Message = forwardRef(
  (
    { id, contents: { timestamp, displayName, email, message, photo, uid } },
    ref
  ) => {
    const user = useSelector(selectUser);

    const emoteMap = {
      'argChamp': 'https://i.imgur.com/XUSntXj.png',
      'baeberle': 'https://i.imgur.com/qjmDcG2.png',
      'bff': 'https://i.imgur.com/sNXGeJY.png',
      'bruhCollins': 'https://i.imgur.com/SO7jFi2.png',
      'bruhPranav': 'https://i.imgur.com/1cJe9k7.png',
      'bruhZombie': 'https://i.imgur.com/M8wQnt6.png',
      'chapter3': 'https://i.imgur.com/55YeZ40.png',
      'chillinNut': 'https://i.imgur.com/DLGBd6l.png',
      'chrisCringe': 'https://i.imgur.com/wJaoMJj.png',
      'coby1': 'https://i.imgur.com/ssjRL7v.png',
      'cockRock': 'https://i.imgur.com/Z6ReaJW.png',
      'codyBad': 'https://i.imgur.com/nsN43XK.png',
      'cory': 'https://i.imgur.com/YD9A86V.png',
      'covidIndian': 'https://i.imgur.com/Df3pYB9.png',
      'danielSad': 'https://i.imgur.com/gNs3gXR.png',
      'darkSam': 'https://i.imgur.com/0dCt2ik.png',
      'dumbass': 'https://i.imgur.com/DrLNgxk.png',
      'esamSad': 'https://i.imgur.com/NPZ5Soa.png',
      'fatFaul': 'https://i.imgur.com/yOqbAvE.png',
      'faul': 'https://i.imgur.com/QFcV0x2.png',
      'hitlerDab': 'https://i.imgur.com/4JDyMHP.png',
      'jeffen': 'https://i.imgur.com/27in4Wc.png',
      'koreanPranav': 'https://i.imgur.com/9Iu8udr.png',
      'leffenPog': 'https://i.imgur.com/VOVIBQv.png',
      'lezGo': 'https://i.imgur.com/ZOIfG16.png',
      'mastarScam': 'https://i.imgur.com/R0Ktgqb.png',
      'mishaBad': 'https://i.imgur.com/YnLiIH0.png',
      'mitsuBruh': 'https://i.imgur.com/uljxsSS.png',
      'myran': 'https://i.imgur.com/TWL0iqQ.png',
      'nairoSquad': 'https://i.imgur.com/RnBa5BL.png',
      'panda': 'https://i.imgur.com/Ndzmhsr.png',
      'purpleHoser': 'https://i.imgur.com/ME1ql3e.png',
      'racism': 'https://i.imgur.com/bafTm1K.png',
      'rageMonster': 'https://i.imgur.com/Q8D0510.png',
      'readySteady': 'https://i.imgur.com/dinNxEs.png',
      'readySteady2': 'https://i.imgur.com/Z7KNoZq.png',
      'rhymeChamp': 'https://i.imgur.com/pKdD6m9.png',
      'rosatiCringe': 'https://i.imgur.com/Xa4AB1X.png',
      'shamikoPit': 'https://i.imgur.com/LDyq7uc.png',
      'sushIndian': 'https://i.imgur.com/n20xZ72.png',
      'tehranSquid': 'https://i.imgur.com/JzJpK0r.png',
      'tomBrady': 'https://i.imgur.com/7OvruNO.png',
      'trashGame': 'https://i.imgur.com/OFXNDLm.png',
      'unionJack': 'https://i.imgur.com/GyMRn88.png',
      'yungMexican': 'https://i.imgur.com/NZrjZMu.png',
      'zeroBait': 'https://i.imgur.com/0LEHa7c.png',
      'zeroTwoof': 'https://i.imgur.com/PtW945R.png'
    };

    const parseMessage = (message) => {
      const emotePattern = /:([a-zA-Z0-9_]+):/g;
      return message.split(emotePattern).map((part, index) => {
        if (emoteMap[part]) {
          return <img key={index} src={emoteMap[part]} alt={part} className="emote" />;
        } else if (emotePattern.test(`:${part}:`)) {
          // If part matches the emote pattern but not in emoteMap, return as plain text
          return `:${part}:`;
        }
        return part;
      });
    };

    return (
      <div
        ref={ref}
        className={`message ${user.email === email && 'message__sender'}`}
      >
        <Avatar src={photo} />
        <p>{parseMessage(message)}</p>
        <small>
          <b>{displayName}</b> - {moment(new Date(timestamp?.toDate()).toUTCString()).fromNow()}
        </small>
      </div>
    );
  }
);

export default Message;
