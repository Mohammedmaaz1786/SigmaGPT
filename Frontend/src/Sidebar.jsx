import React from 'react';
import './Sidebar.css';

function Sidebar() {
    return (
        <section className='sidebar'>
            <button>
                <img src="src/assets/blacklogo.png" alt="gpt logo" className='logo'/>
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>

            <ul className='history'>
                <li>thread1</li>
                <li>thread2</li>
                <li>thread3</li>
            </ul>

            <div className='sign'>
                <p>By Mohammed Maaz &hearts;</p>
            </div>
        </section>
    )
}

export default Sidebar;