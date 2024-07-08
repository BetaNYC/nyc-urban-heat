import { InformationCircleIcon } from "@heroicons/react/24/outline"

type Props = {
    title: string
    img: string
}

const LayerSelectionOption = ({ title, img }: Props) => {



    return (
        <div className="flex justify-between items-center px-6 py-3 hover:bg-[#828282] hover:text-white cursor-pointer" >
            <div className="flex items-center gap-3">
                <div className="flex justify-center items-center w-10 h-10 bg-[#F2F2F2] rounded-full">
                    <img src={img} alt="" className="w-6 h-6" />
                </div>
                <h3 className="text-regular">{title}</h3>
            </div>
            <InformationCircleIcon width={24} height={24} className="" />
        </div>
    )
}

export default LayerSelectionOption