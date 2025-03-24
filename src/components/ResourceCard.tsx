// import linkIcon from '/icons/link.svg';
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline"


type Props = {
    title: string,
    cta: string
    content: string,
    url: string
    logos: [boolean, boolean, boolean, boolean, boolean, boolean, boolean]
    // children: ReactNode
}

const ResourceCard = ({ title, cta, content, url, logos }: Props) => {
    return (
        <div className='flex flex-col justify-between p-6 min-h-[20rem] bg-[#EFEFEF] rounded-[0.75rem] overflow-y-hidden'>
            <div className='flex flex-col'>
                <div className="flex items-start gap-2 h-8">
                    {logos[0] && <img src="/icons/emergency_management.svg" alt="" className="h-full" />}
                    {logos[1] && <img src="/icons/49.svg" alt="" className="w-[56px] h-[26px]" />}
                    {logos[2] && <img src="/icons/park.svg" alt="" className="h-full" />}
                    {logos[3] && <img src="/icons/epa.png" alt="" className="h-full" />}
                    {logos[4] && <img src="/icons/nihhis.png" alt="" className="h-full" />}
                    {logos[5] && <img src="/icons/cdc.png" alt="" className="h-full" />}
                    {logos[6] && <img src="/icons/jacobs.png" alt="" className="h-full" />}

                </div>
                <div className='mt-1 mb-2 font-bold text-[1.5rem] text-black'>
                    {title}
                </div>
                <div className='font-regular text-regular'>
                    {content}
                </div>
            </div>
            <div className="">
                <div className='flex items-center gap-2 mt-4 pl-2 py-3 max-w-[280px] font-semibold  text-[14px] text-left text-[#F3F3F3] bg-[#333333] rounded-[6px]' onClick={() => window.open(`${url}`, '_blank')}>
                    <ArrowTopRightOnSquareIcon  className="w-5 h-5"/>
                    <h3 className="max-w-[80%]">{cta}</h3>
                </div>
            </div>
        </div>
    )
}

export default ResourceCard