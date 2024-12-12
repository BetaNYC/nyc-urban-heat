import { useState } from "react"

type Props = {
    title: string
    tags: string[]
}

const Banner = ({ title, tags }: Props) => {

    const [clickedIndex, setClickedIndex] = useState<string>(tags[0])

    return (
        <div className='relative flex flex-col justify-center items-center w-full h-[20rem] bg-[#1B1B1B]'>
            <div className=" container px-5">
                <div className=" flex justify-between ">
                    <h1 className="font-bold text-[3rem] text-[#EBEBEB]">{title}</h1>
                    <p className="max-w-[25rem] font-regular text-[1rem] text-[#EBEBEB]">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                </div>
                {
                    tags.length > 0 &&
                    <div className="absolute bottom-0 left-0 right-0 mx-auto container px-5 flex">
                        {tags.map((tag, i) =>
                            <button key={tag[i]} className={`flex justify-center items-center py-1 px-3 font-medium text-small border-[1px] border-b-0 rounded-t-[1.125rem] ${clickedIndex === tags[i] ? "text-[#1B1B1B] bg-white border-none " : "text-[#CECECE] bg-[#1B1B1B] border-[#CECECE]"} `} onClick={() => setClickedIndex(tags[i])}>{tags[i]}</button>
                        )}

                        {/* <button className={`flex justify-center items-center py-1 px-3 font-medium text-small border-[1px] border-b-0 rounded-t-[1.125rem] ${clickedIndex === "NYC Extreme Heat Resources" ? "text-[#1B1B1B] bg-white border-none " : "text-[#CECECE] bg-[#1B1B1B] border-[#CECECE]"} `} onClick={() => setClickedIndex("NYC Extreme Heat Resources")}>NYC Extreme Heat Resources</button>
                        <button className={`flex justify-center items-center py-1 px-3 font-medium text-small border-[1px] border-b-0 rounded-t-[1.125rem] ${clickedIndex === "Directory of Urban Heat Advocacy Groups" ? "text-[#1B1B1B] bg-white border-none " : "text-[#CECECE] bg-[#1B1B1B] border-[#CECECE]"} `} onClick={() => setClickedIndex("Directory of Urban Heat Advocacy Groups")}>Directory of Urban Heat Advocacy Groups</button> */}
                    </div>
                }

            </div>

        </div>
    )
}

export default Banner