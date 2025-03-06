import React, { ReactNode } from 'react'

type Props = {
  title: string
  content: string
  img: string
  url:string
  cta:string
}

const AdvocacyGroupsCard = ({ title, content, img, url, cta}: Props) => {
  return (
    <div className='flex flex-col justify-between p-6 min-h-[30rem] bg-[#EFEFEF] rounded-[0.75rem]'>
      <div>
        <img src={img} alt="" className='w-[279px] h-[165px]' />
        <h3 className='mt-6 font-bold text-[1rem] text-black '>{title}</h3>
        <p className="mt-4 mb-6 font-light text-small">{content}</p>
      </div>
      {/* <a href={url} className="underline font-light text-small hover:text-[#EB583B]">{url}</a> */}
      <button className='px-1 mt-4 w-[15rem] h-14 font-semibold text-[1rem] text-[#F3F3F3] bg-[#333333] rounded-[6px]' onClick={() => window.open(`${url}`, '_blank')}>{cta}</button>
    </div>
  )
}

export default AdvocacyGroupsCard