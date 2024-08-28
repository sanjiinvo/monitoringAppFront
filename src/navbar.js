import React from "react";
import {Link} from 'react-router-dom'
import './navbar.scss'

const MenuBar = () => {

    const token = localStorage.getItem('token');
    const currentUser = localStorage.getItem('username');
    const currentUserRole = localStorage.getItem('userrole');
    return (
        <nav className="main-menu">
            <ul className="main-menu-list">
                <li><Link to='/'>Home</Link></li>
                <li><Link to='/admin'>Admin Panel</Link></li>
                <p>{currentUser}</p>
                <p>{currentUserRole}</p>
                
            </ul>
        </nav>
    )

}

export default MenuBar;