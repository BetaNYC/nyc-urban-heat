import {ReactNode} from 'react'

type Props = {
    title: string
    children: ReactNode
}

const ResourceCard = ({ title, children }: Props) => {
    return (
        <div className='flex flex-col gap-6 p-6 h-[18rem] bg-gradient-to-r from-[#EE7B64] to-[#FDEBAB] rounded-[0.75rem] '>
            <div className='font-bold text-[1.25rem] text-black'>
                {title}
            </div>
            <div className='flex-1 font-regular text-regular overflow-y-scroll'>
                {children}
            </div>
        </div>
    )
}

export default ResourceCard