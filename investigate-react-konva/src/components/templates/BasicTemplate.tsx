import React, { ReactNode } from 'react';
import CustomHeader from '../parts/CustomHeader';
import { twMerge } from 'tailwind-merge';

interface BasicTemplateProps {
  children: ReactNode;
  className?: string;
}
const BasicTemplate: React.FC<BasicTemplateProps> = (props) => {
  const { children, className } = props;
  return (
    <>
      <CustomHeader title="React-Konva" />
      <body className={twMerge(className)}>
        <main className={twMerge(className, 'container mx-auto')}>
          {children}
        </main>
      </body>
    </>
  );
};
export default BasicTemplate;
