import React, { ComponentProps, useState } from 'react';
import HamburgerButton from './HamburgerButton';
import HeaderDrawer from './HeaderDrawer';
import DrawerSection from './DrawerSection';
import { Link } from 'react-router-dom';

type CustomHeaderProps = {
  title?: string;
} & ComponentProps<'header'>;

const CustomHeader: React.FC<CustomHeaderProps> = (props) => {
  const { title } = props;
  const [isOpenNav, setIsOpenNav] = useState(false);
  return (
    <header className="sticky top-0 z-50 h-16 bg-blue-400 p-4 shadow-md">
      <section className="container mx-auto flex content-center justify-between px-4">
        <>
          {title && (
            <h1 className="text-[24px] font-bold text-white">
              <Link to={'/'}>{title}</Link>
            </h1>
          )}
          {!isOpenNav && (
            <HamburgerButton
              onClick={() => {
                setIsOpenNav(!isOpenNav);
              }}
            />
          )}
        </>
      </section>
      <DrawerSection
        isOpen={isOpenNav}
        setIsOpen={(value) => {
          setIsOpenNav(value);
        }}
      >
        <HeaderDrawer />
      </DrawerSection>
    </header>
  );
};
export default CustomHeader;
