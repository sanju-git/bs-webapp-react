import React, { useState } from 'react';


const Header = () => {

    return (

        <div className="d-flex align-items-center justify-content-center head clearfix">
            <div className="friday">
                <h2>F.R.I.D.A.Y</h2>
            </div>
            <div className="friday">
                <h4 style={{ marginLeft: 10, marginRight: 10 }}>X</h4>
            </div>
            <div style={{ marginTop: 7 }}>
                <img className='logo' src='/images/bs.png' alt="logo" />
            </div>
        </div>
    );
}

export default Header;