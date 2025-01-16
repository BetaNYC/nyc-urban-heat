// import linkIcon from '/icons/link.svg';


type Props = {
    title: string,
    cta: string
    // children: ReactNode
}

const ResourceCard = ({ title, cta}: Props) => {
    return (
        <div className='flex flex-col justify-between p-6 min-h-[20rem] bg-[#EFEFEF] rounded-[0.75rem] '>
            <div className='flex flex-col gap-6'>
                <div className='font-bold text-[1.5rem] text-black'>
                    {title}
                </div>
                <div className='font-regular text-regular overflow-y-scroll'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto quibusdam optio iste molestias ullam voluptatibus quas nisi. Enim cum, asperiores aliquam totam architecto iusto suscipit optio eius ab amet cumque!
                </div>
            </div>
            <div className="">
                {/* <img className="w-6 h-6" src={linkIcon} alt="" /> */}
                <button className='mt-4 w-[15rem] h-12 font-semibold text-[14px] text-[#F3F3F3] bg-[#333333] rounded-[6px]'>{cta}</button>
            </div>
        </div>
    )
}

export default ResourceCard