

import './Univ.css';
import { useState, useEffect } from 'react';

function Univ() {

    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://universities.hipolabs.com/search?country=Korea,%20Republic%20of');
                const jsonData = await response.json();
                setData(jsonData);
            } catch (e) {
                console.log('Error!!!');
            }
        };
        fetchData();
    }, []);
    return (
        <div className='unibox'>
            <h1>대학 목록 - Open API 예제</h1>
            <ul>
                {data.map(item => (
                    <li key={item.name}>
                        <p><a href={item.web_pages} target='_blank'>{item.name}</a></p>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Univ