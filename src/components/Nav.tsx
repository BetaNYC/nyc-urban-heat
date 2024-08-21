import { useEffect, useState } from "react"
import ProjectLogo from "/icons/NYC Urban Heat Portal.svg"
import { useMediaQuery } from "react-responsive"
import { useNavigate, useLocation } from "react-router"

import { Bars3Icon } from "@heroicons/react/24/outline"



const Nav = () => {

  const [clicked, setClicked] = useState('map')
  const [expanded, setExpanded] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  const isDesktop = useMediaQuery({
    query: '(min-width: 1280px)'
  })
  const isTablet = useMediaQuery({
    query: '(min-width: 768px)'
  })

  const isMobile = useMediaQuery({
    query: '(max-width: 768px)'
  })

  const clickHandler = (page: "map" | "resources" | "about" | "download") => {
    setClicked(page)
    switch (page) {
      case "map":
        navigate("/nyc-urban-heat/")
        break;
      case "resources":
        navigate("/nyc-urban-heat/resources")
        break;
      case "about":
        navigate('/nyc-urban-heat/about')
        break;
      case "download":
        navigate('/nyc-urban-heat/download')
        break;
    }
  }

  const navBarClickHandler = () => {
    setExpanded(!expanded)
  }

  useEffect(() => {
    location.pathname === "/nyc-urban-heat/" ? setClicked('map')
      : location.pathname === "/nyc-urban-heat/resources" ? setClicked('resources')
        : location.pathname === "/nyc-urban-heat/about" ? setClicked('about')
          : setClicked('download')
  }, [])



  return (
    <nav className='flex justify-center w-full h-[3.125rem] bg-[#333] '>
      <div className="relative flex justify-between items-center px-5  container h-full bg-[#333]">
        <img src={ProjectLogo} alt="Urban Heat logo" className='cursor-pointer' onClick={() => clickHandler('map')} />
        {isMobile && <Bars3Icon className="text-white w-6 h-6 cursor-pointer" onClick={navBarClickHandler} />}
        {
          isMobile && expanded &&
          <div className="absolute right-0 top-[3.125rem] flex flex-col items-start w-[5.625rem] bg-white border-r-[1px] border-l-[1px] border-b-[1px] border-[#828282] z-30">
            <button className="px-1 py-2 w-full font-regular text-left hover:text-white hover:bg-[#828282] border-b-[1.5px] border-[#828282]" onClick={() => clickHandler("map")}>Map</button>
            <button className="px-1 py-2 w-full font-regular text-left hover:text-white hover:bg-[#828282] border-b-[1.5px] border-[#828282]" onClick={() => clickHandler("resources")}>Resources</button>
            <button className="px-1 py-2 w-full font-regular text-left hover:text-white hover:bg-[#828282] border-b-[1.5px] border-[#828282]" onClick={() => clickHandler("download")}>Download</button>
            <button className="px-1 py-2 w-full font-regular text-left hover:text-white hover:bg-[#828282]" onClick={() => clickHandler("about")}>About</button>
          </div>
        }
        {
          isTablet && <div className={`flex text-regular ${isDesktop ? "gap-[6rem]" :  "gap-[2rem]"}`}>
            <button className={`font-bold text-[#7E7E7E] hover:text-[#FF7E6C] ${clicked === 'map' && "text-[#FF7E6C]"}`} onClick={() => clickHandler("map")}>Map</button>
            <button className={`font-bold text-[#7E7E7E] hover:text-[#FF7E6C] ${clicked === 'resources' && "text-[#FF7E6C]"}`} onClick={() => clickHandler("resources")}>Resources</button>
            <button className={`font-bold text-[#7E7E7E] hover:text-[#FF7E6C] ${clicked === "download" && "text-[#FF7E6C]"}`} onClick={() => clickHandler("download")}>Download</button>
            <button className={`font-bold text-[#7E7E7E] hover:text-[#FF7E6C] ${clicked === 'about' && "text-[#FF7E6C]"}`} onClick={() => clickHandler("about")}>About</button>
          </div>
        }
      </div>

    </nav>
  )
}

export default Nav