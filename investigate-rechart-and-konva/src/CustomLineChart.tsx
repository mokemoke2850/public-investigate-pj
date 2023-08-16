import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
const data = [
  { name: 'Page A', uv: 400, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 300, pv: 2400, amt: 2400 },
  { name: 'Page C', uv: 300, pv: 2400, amt: 2400 },
  { name: 'Page D', uv: 200, pv: 2400, amt: 2400 },
  { name: 'Page E', uv: 278, pv: 2400, amt: 2400 },
  { name: 'Page F', uv: 189, pv: 2400, amt: 2400 },
];

const CustomLineChart = () => {
  return (
    <LineChart
      width={600}
      height={300}
      data={data}
      style={{ marginY: '6px', marginX: '3px' }}
    >
      <CartesianGrid stroke="#ccc" />
      <Line type="monotone" dataKey="uv" stroke="#8884d8" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
    </LineChart>
  );
};
export default CustomLineChart;
