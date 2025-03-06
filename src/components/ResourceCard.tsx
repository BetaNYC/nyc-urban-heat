// import linkIcon from '/icons/link.svg';


type Props = {
    title: string,
    cta: string
    content: string,
    url:string
    // children: ReactNode
}

const ResourceCard = ({ title, cta, content, url }: Props) => {
    return (
        <div className='flex flex-col justify-between p-6 min-h-[20rem] bg-[#EFEFEF] rounded-[0.75rem] '>
            <div className='flex flex-col'>
                <div className="flex items-start gap-2">
                    <img src="/icons/emergency_management.svg" alt="" className="w-12 h-[29px]"/>
                    <img src="/icons/49.svg" alt="" className="w-[56px] h-[26px]"/>
                    <img src="/icons/park.svg" alt="" className="w-6"/>
                </div>
                <div className='my-2 font-bold text-[1.5rem] text-black'>
                    {title}
                </div>
                <div className='font-regular text-regular overflow-y-scroll'>
                    {content}
                </div>
            </div>
            <div className="">

                <button className='mt-4 w-[15rem] h-14 font-semibold text-[14px] text-[#F3F3F3] bg-[#333333] rounded-[6px]'  onClick={() => window.open(`${url}`, '_blank')}>{cta}</button>
            </div>
        </div>
    )
}

export default ResourceCard