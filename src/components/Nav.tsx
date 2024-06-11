import React from 'react'

import ProjectLogo from "/icons/NYC Urban Heat Portal.svg"

const Nav = () => {
  return (
    <nav className='flex justify-between items-center px-6 w-full h-[3.125rem] bg-[#333]'>
        <img src={ProjectLogo} alt="Urban Heat logo" className='' />
        <div className='flex gap-[6rem]'>
            <button className='font-bold text-[#7E7E7E] hover:text-[#FF7E6C]'>Map</button>
            <button className='font-bold text-[#7E7E7E] hover:text-[#FF7E6C]'>Resources</button>
            <button className='font-bold text-[#7E7E7E] hover:text-[#FF7E6C]'>About</button>
            <button className='font-bold text-[#7E7E7E] hover:text-[#FF7E6C]'>Download</button>
        </div>
    </nav>
  )
}

export default Nav