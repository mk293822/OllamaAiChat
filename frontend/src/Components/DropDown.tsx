import { Transition } from "@headlessui/react";
import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react";

const DropDownContext = createContext<{
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  toggleOpen: () => void;
}>({
  open: false,
  setOpen: () => {},
  toggleOpen: () => {},
});

const Dropdown = ({ children }: PropsWithChildren) => {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => {
    setOpen((previousState) => !previousState);
  };

  return (
    <DropDownContext.Provider value={{ open, setOpen, toggleOpen }}>
      <div className="relative">{children}</div>
    </DropDownContext.Provider>
  );
};

const Trigger = ({ children }: PropsWithChildren) => {
  const { open, setOpen, toggleOpen } = useContext(DropDownContext);

  return (
    <>
      <div onClick={toggleOpen}>{children}</div>

      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
        ></div>
      )}
    </>
  );
};

const Content = ({
  align = "right",
  width = "40",
  contentClasses = "py-2 bg-gray-600",
  children,
}: PropsWithChildren<{
  align?: "left" | "right";
  width?: "40";
  contentClasses?: string;
}>) => {
  const { open, setOpen } = useContext(DropDownContext);

  let alignmentClasses = "origin-top";

  if (align === "left") {
    alignmentClasses = "ltr:origin-top-left rtl:origin-top-right start-0";
  } else if (align === "right") {
    alignmentClasses = "ltr:origin-top-right rtl:origin-top-left end-0";
  }

  let widthClasses = "";

  if (width === "40") {
    widthClasses = "w-40";
  }

  return (
    <>
      <Transition
        show={open}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div
          className={`absolute z-50 mt-2 rounded-md shadow-lg ${alignmentClasses} ${widthClasses}`}
          onClick={() => setOpen(false)}
        >
          <div className={`rounded-md px-2 rounded-lg ` + contentClasses}>
            {children}
          </div>
        </div>
      </Transition>
    </>
  );
};

const Button = ({
  className = "",
  children,
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      {...props}
      type={type}
      className={
        "block w-full ps-2 py-1 rounded-lg text-start text-xs leading-5 text-gray-300 transition duration-150 ease-in-out hover:bg-gray-500 focus:bg-gray-500 " +
        className
      }
    >
      {children}
    </button>
  );
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Button = Button;

export default Dropdown;
