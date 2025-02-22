// import React from 'react'
import LogoB from '../assets/tick-in-a -box.svg';
import LogoW from '../assets/tick-in-a -box-white.svg'
import PropTypes from 'prop-types';

export default function Logo({ imgWidth, textSize, color }) {
    if (color === 'black') {
        return (
            <div className='flex items-center justify-center '>
                <img src={LogoB} alt="logo" className={`w-[${imgWidth}]`} />
                <p className={` text-[${textSize}] font-bold text-[#1D1D1B]`}>OnVote</p>
            </div>
          )
    } else {
        return (
            <div className='flex items-center'>
                <img src={LogoW} alt="logo" className={`w-[${imgWidth}]`} />
                <p className={` text-[${textSize}] font-bold text-[#f6f8fa]`}>OnVote</p>
            </div>
          )
    }
  
}

Logo.propTypes = {
    imgWidth: PropTypes.string,
    textSize: PropTypes.string,
    color: PropTypes.bool,
};
