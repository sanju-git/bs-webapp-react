import React, { useState } from 'react';


const Header = () => {

    return (

        <div className="d-flex align-items-center justify-content-center head clearfix">            
            <div style={{ marginTop: 7 }}>
                <img className='logo' src='/images/logo.png' alt="logo" />
            </div>
        </div>
    );
}

export default Header;