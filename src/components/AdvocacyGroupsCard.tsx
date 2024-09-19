import React, { ReactNode } from 'react'

type Props = {
  title: string
  content: string
  url: string
}

const AdvocacyGroupsCard = ({ title, content }: Props) => {
  return (
    <div className='flex flex-col p-6 h-[26.5rem] bg-[#EFEFEF] rounded-[0.75rem]'>
      <div className='w-full h-[10rem] bg-white'></div>
      <h3 className='mt-6 mb-4 h-12 font-bold text-[1rem] text-black leading-snug'>{title}</h3>
      <div className='flex-1 font-regular text-regular text-black overflow-y-scroll'>
        <p className="font-light text-small">{content}</p>
        {/* <a href={url} className="underline font-light text-small hover:text-[#EB583B]">{url}</a> */}
      </div>
    </div>
  )
}

export default AdvocacyGroupsCard