import {
  Button,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import CustomCell from './CustomCell';
import { useState } from 'react';

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];
function CustomCellStyle() {
  const [isMerge, setIsMerge] = useState(false);

  return (
    <>
      <Button
        variant="contained"
        onClick={() => {
          setIsMerge((prev) => !prev);
        }}
      >
        {isMerge ? 'Merge' : 'UnMerge'}
      </Button>
      <TableContainer component={Paper} sx={{ width: 650, boxShadow: 'none' }}>
        <Table
          sx={{ width: '100%', boxShadow: 'none' }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <CustomCell cellProps={{ align: 'center' }}>
                Dessert (100g serving)
              </CustomCell>
              <CustomCell cellProps={{ align: 'center' }}>Calories</CustomCell>
              <CustomCell cellProps={{ align: 'center' }}>
                Fat&nbsp;(g)
              </CustomCell>
              <CustomCell cellProps={{ align: 'center' }}>
                Carbs&nbsp;(g)
              </CustomCell>
              <CustomCell cellProps={{ align: 'center' }}>
                Protein&nbsp;(g)
              </CustomCell>
              <CustomCell cellProps={{ align: 'center' }}>Note</CustomCell>
              <CustomCell cellProps={{ align: 'center' }}>Note2</CustomCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={row.name}>
                <CustomCell cellProps={{ component: 'th', scope: 'row' }}>
                  {row.name}
                </CustomCell>
                <CustomCell cellProps={{ align: 'right' }}>
                  {row.calories}
                </CustomCell>
                <CustomCell cellProps={{ align: 'right' }}>
                  {row.fat}
                </CustomCell>
                <CustomCell cellProps={{ align: 'right' }}>
                  {row.carbs}
                </CustomCell>
                <CustomCell cellProps={{ align: 'right' }}>
                  {row.protein}
                </CustomCell>
                {isMerge ? (
                  index === 0 && (
                    <CustomCell
                      cellProps={{
                        rowSpan: rows.length,
                        colSpan: 2,
                        sx: {
                          padding: 0,
                          height: '10px',
                          verticalAlign: 'top',
                        },
                      }}
                    >
                      <TextField
                        size="small"
                        sx={{
                          backgroundColor: 'lightgray',
                          border: 'none',
                          width: '100%',
                          height: '100%',
                          borderRadius: 0,
                          padding: 0,
                          '& .MuiOutlinedInput-input': {
                            padding: 0,
                          },
                          '& .MuiInputBase-root': {
                            height: '100%',
                          },
                        }}
                      />
                    </CustomCell>
                  )
                ) : (
                  <CustomCell
                    cellProps={{
                      sx: {
                        padding: 0,
                        height: '10px',
                        verticalAlign: 'top',
                      },
                    }}
                  >
                    <TextField
                      size="small"
                      sx={{
                        backgroundColor: 'lightgray',
                        border: 'none',
                        width: '100%',
                        height: '100%',
                        borderRadius: 0,
                        padding: 0,
                        '& .MuiOutlinedInput-input': {
                          padding: 0,
                        },
                        '& .MuiInputBase-root': {
                          height: '100%',
                        },
                      }}
                    />
                  </CustomCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
export default CustomCellStyle;
