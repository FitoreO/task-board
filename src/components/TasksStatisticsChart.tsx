import { Cell, Legend, Pie, PieChart, PieLabelRenderProps } from "recharts";
import { useKanbanMetadata } from "./hooks/useKanbanMeta";
import { Box } from "@mui/material";
import { flexColumn } from "../styles/flex";

const RADIAN = Math.PI / 180;
const COLORS = ["#ff0000", "#ed6c02", "#008000"];

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: PieLabelRenderProps) => {
  if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
    return null;
  }
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const ncx = Number(cx);
  const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const ncy = Number(cy);
  const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > ncx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${((percent ?? 1) * 100).toFixed(0)}%`}
    </text>
  );
};

type ChartProps = {
  isAnimationActive?: boolean;
};

const style = {
  top: "50%",
  right: -70,
  transform: "translate(0, -50%)",
  lineHeight: "24px",
};

export default function TasksStatisticsChart({
  isAnimationActive = true,
}: ChartProps) {
  const { allTasks } = useKanbanMetadata(true);

  if (!allTasks || allTasks.length === 0) {
    return <div>Loading...</div>;
  }

  const todaysDate = new Date();

  const createdDate = allTasks.map((task) => new Date(task.createdAt));

  const daysOpen = createdDate.map((date) =>
    Math.floor((todaysDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)),
  );

  const oldCount = daysOpen.filter((days) => days > 14).length;
  const quiteNewCount = daysOpen.filter(
    (days) => days > 7 && days <= 14,
  ).length;
  const newCount = daysOpen.filter((days) => days <= 7).length;

  const data = [
    { name: "14+ days", value: oldCount },
    { name: "7–14 days", value: quiteNewCount },
    { name: "0–7 days", value: newCount },
  ];

  return (
    <Box
      sx={{
        ...flexColumn,
        width: "100%",
      }}
    >
      <PieChart
        style={{
          width: "100%",
          maxWidth: "500px",
          maxHeight: "80vh",
          marginLeft: "auto",
          marginRight: "auto",

          aspectRatio: 1,
        }}
        responsive
      >
        <Pie
          data={data}
          labelLine={false}
          label={renderCustomizedLabel}
          fill="#8884d8"
          dataKey="value"
          isAnimationActive={isAnimationActive}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${entry.name}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Legend
          iconSize={10}
          layout="vertical"
          verticalAlign="middle"
          wrapperStyle={style}
          itemSorter={(item) => data.findIndex((d) => d.name === item.value)}
        />
      </PieChart>
    </Box>
  );
}
