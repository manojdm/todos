import React from 'react'

const Header = () => {
  return (
    <div className="home-nav-bar">
        <nav>
            <div className="title">
                TODO APP
            </div>
            <div className="nav-items">
                <ul>
                    <li className="item current"><a href="#">Login</a></li>
                    <li className="item"><a href="#">Sign up</a></li>
                </ul>
            </div>
        </nav>
    </div>
  )
}

export default Header