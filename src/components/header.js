import React, { useState } from 'react';
import bs from "../assets/bs.png"

const Header = () => {

    return (

        <div className="d-flex align-items-center justify-content-center head clearfix">            
            <div style={{ marginTop: 7 }}>
                <img className='logo' src={bs} alt="logo" />
            </div>
        </div>
    );
}

export default Header;