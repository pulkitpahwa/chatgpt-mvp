import { ChevronDownLg } from "@openai/apps-sdk-ui/components/Icon";

interface MorganFaqSectionProps {
  onClose?: () => void;
}

export function MorganFaqSection({ onClose }: MorganFaqSectionProps) {
  return (
    <div id="morgan-matched-faq" className="flex flex-col gap-4 py-4">
      <div className="bg-background-tertiary rounded-lg flex flex-col border border-[1px] border-[#0D0D0D0D] shadow-md">
        <details className="group border border-[1px] border-[#0D0D0D0D] ">
          <summary className="flex cursor-pointer list-none items-center justify-between p-4 text-[17px] leading-[24px] font-[400] text-[#0D0D0D]">
            Why Morgan & Morgan?
            <span className="transition-transform group-open:rotate-180 rounded-full w-[34px] h-[34px] bg-[#F3F3F3] flex items-center justify-center text-[34px]">
              <ChevronDownLg className="w-[16px]" />{" "}
            </span>
          </summary>

          <div className="p-4 pt-0 text-gray-600 text-[14px] leading-[20px] text-[#0D0D0D]">
            Morgan & Morgan is one of the largest and most trusted
            plaintiff-side law firms in the nation, with a track record of
            recovering over $25 billion for clients.{" "}
          </div>
        </details>
        <details className="group border border-[1px] border-[#0D0D0D0D] ">
          <summary className="flex cursor-pointer list-none items-center justify-between p-4 text-[17px] leading-[24px] font-[400] text-[#0D0D0D]">
            Are my conversations confidential?
            <span className="transition-transform group-open:rotate-180 rounded-full w-[34px] h-[34px] bg-[#F3F3F3] flex items-center justify-center text-[34px]">
              <ChevronDownLg className="w-[16px]" />{" "}
            </span>
          </summary>

          <div className="p-4 pt-0 text-gray-600 text-[14px] leading-[20px] text-[#0D0D0D]">
            Conversations with lawyers are privileged and confidential.
            Conversations with the AI are protected for privacy, but not
            attorney-client privileged.{" "}
          </div>
        </details>
        <details className="group border border-[1px] border-[#0D0D0D0D] ">
          <summary className="flex cursor-pointer list-none items-center justify-between p-4 text-[17px] leading-[24px] font-[400] text-[#0D0D0D]">
            Is there any cost to me?
            <span className="transition-transform group-open:rotate-180 rounded-full w-[34px] h-[34px] bg-[#F3F3F3] flex items-center justify-center text-[34px]">
              <ChevronDownLg className="w-[16px]" />{" "}
            </span>
          </summary>

          <div className="p-4 pt-0 text-gray-600 text-[14px] leading-[20px] text-[#0D0D0D]">
            No, sharing your details and receiving a consultation is completely
            free. If your case is accepted, Morgan & Morgan works on a
            contingency fee basis, meaning you pay nothing unless they win your
            case.
          </div>
        </details>
        <div className="p-4 flex justify-center">
          <button
            onClick={() => {
              if (onClose) onClose();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="w-[305px] h-[52px] rounded-[24px] bg-background-primary border-[1px] border-[#0D0D0D1A] text-[14px] leading-[20px] text-[#0D0D0D] font-[600] py-3 rounded hover:bg-gray-100 transition"
          >
            Go to Inhouse App
          </button>
        </div>
      </div>
    </div>
  );
}
