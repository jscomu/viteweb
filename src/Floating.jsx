
import './Floating.css';
import { useState } from 'react';

const Floating = () => {
    function ckBtn() {
        setIsVis(!isVis);
    }

    const [isVis, setIsVis] = useState(false);

    return (
        <div className='ft_container'>
            <div className={`noti ${!isVis ? 'hidden' : ''}`}>
                <h2>공지사항</h2>
                <p>안녕하세요</p>
                <p>
                    공지가 있습니다.공지가 있습니다.공지가 있습니다.공지가 있습니다.
                </p>
                <p>
                    공지사항 이번주 수업은 리액트입니다.
                </p>
                <p>
                    공지가 있습니다.공지가 있습니다.공지가 있습니다.공지가 있습니다.
                </p>
            </div>
            <button className='togbtn' onClick={ckBtn}>
                {isVis ? '닫기' : '공지'}
            </button>
        </div>
    )
}

export default Floating;