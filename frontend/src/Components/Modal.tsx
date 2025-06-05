import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import type { PropsWithChildren } from "react";

export default function Modal({
  children,
  show = false,
}: PropsWithChildren<{
  show: boolean;
}>) {
    

  return (
    <Transition show={show} leave="duration-100">
      <Dialog
        as="div"
        id="modal"
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        onClose={() => {}}
        static
      >
        <TransitionChild
          enter="ease-out duration-100"
          enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enterTo="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100 translate-y-0 sm:scale-100"
          leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <DialogPanel
            className={`bg-gray-700 text-gray-200 w-full max-w-xl rounded-xl shadow-xl border border-gray-600 animate-fade-in-up`}
          >
            {children}
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}
