import React, { ComponentProps } from 'react';

type HamburgerButtonProps = {
  onClick: () => void;
} & ComponentProps<'button'>;

const HamburgerButton: React.FC<HamburgerButtonProps> = (props) => {
  const { onClick } = props;

  return (
    <button className="z-10 space-y-2 " type="button" onClick={onClick}>
      <div className={'h-0.5 w-6 bg-gray-600'} />
      <div className={'h-0.5 w-6 bg-gray-600'} />
      <div className={'h-0.5 w-6 bg-gray-600'} />
    </button>
  );
};
export default HamburgerButton;
