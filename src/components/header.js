import React, { useState } from 'react';

const Header = () => {

    return (
        <div className='head d-flex align-items-center justify-content-center'>
            <div className='bsc-arrow-wrapper'>
                <img className='bsc-arrow' src='/images/bsc-advancing-arrows.svg' alt="logo" />
            </div>
            <div className="d-flex align-items-center justify-content-center clearfix">
                <div className="friday">
                    <h1>F.R.I.D.A.Y</h1>
                </div>
            </div>
            <div className='bs-logo'>
                <div>
                    <img className='logo' src='/images/bsc-white.svg' alt="logo" />
                </div>
            </div>
        </div>
    )
}

export default Header;