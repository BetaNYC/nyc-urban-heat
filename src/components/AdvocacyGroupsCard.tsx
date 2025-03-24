import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline"

type Props = {
  title: string
  content: string
  img: string
  url: string
  cta: string
}

const AdvocacyGroupsCard = ({ title, content, img, url, cta }: Props) => {
  return (
    <div className='flex flex-col justify-between p-6 min-h-[30rem] bg-[#EFEFEF] rounded-[0.75rem]'>
      <div>
        <img src={img} alt="" className='w-[279px] h-[165px]' />
        <h3 className='mt-6 font-bold text-[1rem] text-black '>{title}</h3>
        <p className="mt-4 mb-6 font-light text-small">{content}</p>
      </div>
      {/* <a href={url} className="underline font-light text-small hover:text-[#EB583B]">{url}</a> */}
      <div className='flex items-center gap-2 mt-4 pl-2 py-3 max-w-[280px] font-semibold  text-[14px] text-left text-[#F3F3F3] bg-[#333333] rounded-[6px]' onClick={() => window.open(`${url}`, '_blank')}>
        <ArrowTopRightOnSquareIcon className="w-5 h-5" />
        <h3 className="max-w-[80%]">{cta}</h3>
      </div>
    </div>
  )
}

export default AdvocacyGroupsCard