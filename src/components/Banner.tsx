import React from "react";

type Props = {
  title: string;
  tags: string[];
  clickedIndex?: string;
  setClickedIndex?: (value: string) => void;
};

const Banner = ({ title, tags, clickedIndex, setClickedIndex }: Props) => {
  return (
    <div className="relative flex flex-col justify-center items-center w-full h-[20rem] bg-[#1B1B1B]">
      <div className="container px-5">
        <div className="flex justify-between">
          <h1 className="font-bold text-[3rem] text-[#EBEBEB]">{title}</h1>
          <p className="max-w-[25rem] font-regular text-[1rem] text-[#EBEBEB]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        {tags.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 mx-auto container px-5 flex">
            {tags.map((tag, _) => (
              <button
                key={tag}
                className={`flex justify-center items-center py-1 px-3 font-medium text-small border-[1px] border-b-0 rounded-t-[1.125rem] ${
                  clickedIndex === tag
                    ? "text-[#1B1B1B] bg-white border-none"
                    : "text-[#CECECE] bg-[#1B1B1B] border-[#CECECE]"
                }`}
                onClick={() => setClickedIndex!(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Banner;
