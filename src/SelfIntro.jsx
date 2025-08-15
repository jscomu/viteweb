import React from 'react';
import './SelfIntro.css';

const SelfIntro = () => {
  return (
    <div className="self-intro-container">
      <h1>나를 소개합니다.</h1>
      <img src="/bbb7.jpg" alt="profile" className="profile-pic" />
      <p>
        <ul>
          <li>직업 : 학생</li>
          <li>학년 : 3학년</li>
          <li>취미 : 게임</li>
        </ul>
      </p>
      <p>-</p>
      <p>
        저는 리액트를 공부하고 있는 학생입니다. 
        이 사이트는 저의 리액트 실력을 보여주기 위해 만들었습니다.
      </p>
      <p>
        IT에 관심이 많아서 다른 개발도 진행할 예정입니다.
      </p>
      <p>
        앞으로 더 많은 기능을 추가할 예정이니 기대해주세요!
      </p>
    </div>
  );
};

export default SelfIntro;
