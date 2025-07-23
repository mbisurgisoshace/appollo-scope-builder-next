import Interview from "@/components/Blocks/Interview";
import { ChevronUpIcon, PlusIcon } from "lucide-react";
import Image from "next/image";

export default function TestPage() {
  return (
    <div className="w-full h-full bg-red flex items-center justify-center bg-[#E1E9F2]">
      <div>
        <div className="overflow-hidden relative w-56 border-white border-2 rounded-2xl rounded-bl-none rounded-tr-none">
          <div
            style={{
              background:
                "linear-gradient(90deg, #6376F1 0%, rgba(99, 118, 241, 0) 100%)",
              opacity: 0.18,
            }}
            className="absolute w-full h-full top-0 left-0"
          />
          <div className="px-10 py-2 font-semibold text-[#6376F2] text-2xl">
            Interview
          </div>
        </div>
        <div
          className="bg-[#EEF4FB] border-2 border-white rounded-2xl rounded-tr-none p-8 w-full h-full shadow-xl rounded-tl-none"
          style={{
            width: 760,
            //height: 360,
          }}
        >
          <div className="flex flex-row rounded-2xl bg-white">
            {/* Div represenint possible image */}
            <div className="w-[170px] h-[202px] relative">
              <div className="bg-gray-500 absolute w-full h-full" />
              <div className="flex flex-col absolute bottom-0 w-full px-3 py-6 pb-3">
                <span className="font-medium text-xs text-white">
                  Anastasia Wellington
                </span>
                <span className="font-medium text-[10px] text-white">
                  Project manager
                </span>
              </div>
            </div>

            <div className="p-6 flex-1">
              <h3 className="font-semibold text-lg text-[#2B2B2C] mb-4">
                Problem Stories
              </h3>
              <p className="font-normal text-[14px]">
                As we collect problem stories, we may have to also organize /
                structure / group problem stories Example: Agri-Dealer: any sort
                of ordering of products from different suppliers is grouped
                under one umbrella of problem stories instead of them being
                separate (as the rules for ordering from each supplier maybe
                slightly different from each other)
              </p>
            </div>
          </div>

          <div className="mt-5 mb-4">
            <span className="font-semibold text-[#2B2B2C] text-sm opacity-50">
              Attachements
            </span>

            <div className="mt-4">
              <div className="flex rounded-lg flex-col items-center justify-center text-[#4683F5] bg-white w-40 h-40">
                <PlusIcon />
                <span className="text-sm font-medium">Add files</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-4xl w-9 flex ml-auto mr-auto items-center justify-center">
            <ChevronUpIcon />
          </div>
        </div>
      </div>
    </div>
  );
}
