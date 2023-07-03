import React, { ComponentProps } from 'react';

type CustomButtonProps = {
  children: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
} & ComponentProps<'button'>;

const CustomButton: React.FC<CustomButtonProps> = (props) => {
  const { children, onClick } = props;
  return (
    <button
      className="
    min-w-24
    w-full
    whitespace-nowrap
    rounded
    border-4
    border-solid 
    border-transparent
    bg-sky-400
    p-1
    text-lg
    font-semibold
    text-white
    shadow-sm
    duration-300
    hover:bg-sky-600
    active:translate-y-1
    active:border-sky-600
    active:bg-sky-700
    "
      onClick={onClick}
    >
      {children}
    </button>
  );
};
export default CustomButton;
