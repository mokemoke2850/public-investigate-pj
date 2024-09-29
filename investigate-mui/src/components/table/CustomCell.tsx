import { SxProps, TableCell, TableCellProps } from '@mui/material';
import React from 'react';

interface CustomCellProps {
  children: React.ReactNode;
  cellProps?: TableCellProps;
}

function CustomCell(props: CustomCellProps) {
  const defaultStyle: SxProps = {
    padding: '1px',
    border: '1px rgba(224, 224, 224, 1) solid',
  };
  const sx = props?.cellProps?.sx ?? {};
  return (
    <TableCell {...props.cellProps} sx={{ ...defaultStyle, ...sx }}>
      {props.children}
    </TableCell>
  );
}
export default CustomCell;
