import { useState } from "react"
import ProjectLogo from "/icons/NYC Urban Heat Portal.svg"
import { useMediaQuery } from "react-responsive"
import { useNavigate } from "react-router"



const Nav = () => {

  const [clicked, setClicked] = useState('map')

  const navigate = useNavigate()


  const isDesktop = useMediaQuery({
    query: '(min-width: 1280px)'
  })
  const isTablet = useMediaQuery({
    query: '(min-width: 1024px)'
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


  return (
    <nav className='flex justify-between items-center px-6 w-full h-[3.125rem] bg-[#333]'>
      <img src={ProjectLogo} alt="Urban Heat logo" className='' />
      <div className={`flex text-regular ${isDesktop ? "gap-[6rem]" : isTablet ? "gap-[4rem]" : "gap-[2rem]"}`}>
        <button className={`font-bold text-[#7E7E7E] hover:text-[#FF7E6C] ${clicked === 'map' && "text-[#FF7E6C]"}`} onClick={() => clickHandler("map")}>Map</button>
        <button className={`font-bold text-[#7E7E7E] hover:text-[#FF7E6C] ${clicked === 'resources' && "text-[#FF7E6C]"}`} onClick={() => clickHandler("resources")}>Resources</button>
        <button className={`font-bold text-[#7E7E7E] hover:text-[#FF7E6C] ${clicked === 'about' && "text-[#FF7E6C]"}`} onClick={() => clickHandler("about")}>About</button>
        <button className={`font-bold text-[#7E7E7E] hover:text-[#FF7E6C] ${clicked === "download" && "text-[#FF7E6C]"}`} onClick={() => clickHandler("download")}>Download</button>
      </div>
    </nav>
  )
}

export default Nav