import React, { useState } from "react"
import { NavLink } from "react-router-dom"
import ProjectLogo from "/icons/NYC Urban Heat Portal.svg"
import { useMediaQuery } from "react-responsive"
import { Bars3Icon } from "@heroicons/react/24/outline"

interface NavButtonProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const Nav: React.FC = () => {
  const [expanded, setExpanded] = useState<boolean>(false)
  
  const isDesktop = useMediaQuery({
    query: '(min-width: 1280px)'
  })
  const isTablet = useMediaQuery({
    query: '(min-width: 768px)'
  })
  const isMobile = useMediaQuery({
    query: '(max-width: 768px)'
  })

  const navBarClickHandler = (): void => {
    setExpanded(!expanded)
  }

  const NavButton: React.FC<NavButtonProps> = ({ to, children, className }) => (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `font-bold ${isActive ? 'text-[#FF7E6C]' : 'text-[#7E7E7E]'} hover:text-[#FF7E6C] ${className || ''}`
      }
    >
      {children}
    </NavLink>
  )

  return (
    <nav className='flex justify-center w-full h-[3.125rem] bg-[#1B1B1B]'>
      <div className={`relative flex justify-between items-center px-5 container h-full bg-[#1B1B1B]`}>
        <NavLink to="/">
          <img src={ProjectLogo} alt="Urban Heat logo" className='cursor-pointer' />
        </NavLink>
        {isMobile && <Bars3Icon className="text-white w-6 h-6 cursor-pointer" onClick={navBarClickHandler} />}
        {
          isMobile && expanded &&
          <div className="absolute right-0 top-[3.125rem] flex flex-col items-start w-[5.625rem] bg-white border-r-[1px] border-l-[1px] border-b-[1px] border-[#828282] z-30">
            <NavButton to="/" className="px-1 py-2 w-full font-regular text-left hover:text-white hover:bg-[#828282] border-b-[1.5px] border-[#828282]">Map</NavButton>
            <NavButton to="/resources" className="px-1 py-2 w-full font-regular text-left hover:text-white hover:bg-[#828282] border-b-[1.5px] border-[#828282]">Resources</NavButton>
            <NavButton to="/download" className="px-1 py-2 w-full font-regular text-left hover:text-white hover:bg-[#828282] border-b-[1.5px] border-[#828282]">Download</NavButton>
            <NavButton to="/about" className="px-1 py-2 w-full font-regular text-left hover:text-white hover:bg-[#828282]">About</NavButton>
          </div>
        }
        {
          isTablet && 
          <div className={`flex text-regular ${isDesktop ? "gap-[6rem]" : "gap-[2rem]"}`}>
            <NavButton to="/">Map</NavButton>
            <NavButton to="/resources">Resources</NavButton>
            <NavButton to="/download">Download</NavButton>
            <NavButton to="/about">About</NavButton>
          </div>
        }
      </div>
    </nav>
  )
}

export default Nav