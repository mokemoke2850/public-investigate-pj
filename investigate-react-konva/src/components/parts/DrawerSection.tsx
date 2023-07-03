import React from 'react';

interface DrawerSectionProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  children: React.ReactNode;
}
const DrawerSection: React.FC<DrawerSectionProps> = (props) => {
  const { isOpen, setIsOpen, children } = props;
  return (
    <main
      className={
        ' fixed inset-0 z-10 transform overflow-hidden bg-gray-900 bg-opacity-25 ease-in-out ' +
        (isOpen
          ? ' translate-x-0 opacity-100 transition-opacity duration-500  '
          : ' translate-x-full opacity-0 transition-all delay-500  ')
      }
    >
      <section
        className={
          ' delay-400 absolute right-0 h-full w-screen max-w-sm transform bg-white shadow-xl transition-all duration-500 ease-in-out  ' +
          (isOpen ? ' translate-x-0 ' : ' translate-x-full ')
        }
      >
        <article className="relative flex h-full w-screen max-w-sm flex-col space-y-6 overflow-y-scroll pb-10">
          {children}
        </article>
      </section>
      <section
        className=" h-full w-screen cursor-pointer "
        onClick={() => {
          setIsOpen(false);
        }}
      ></section>
    </main>
  );
};
export default DrawerSection;
