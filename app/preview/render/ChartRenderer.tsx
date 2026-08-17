"use client";

import React, { memo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartBlock } from "../types/blocks";
import { blockFrame } from "../utils/blockStyles";

interface Props {
  block: ChartBlock;
}

const ChartRenderer = memo(function ChartRenderer({ block }: Props) {
  if (block.hidden) return null;

  const { style, points } = block;
  const palette = [
    style.primaryColor,
    style.secondaryColor,
    "#22c55e",
    "#f59e0b",
    "#ec4899",
  ];
  const common = {
    data: points,
    margin: { top: block.title ? 26 : 8, right: 12, bottom: 8, left: 4 },
  };
  const animationDuration = style.animation ? style.animationDuration : 0;

  const axes = (
    <>
      {style.showGrid && (
        <CartesianGrid stroke={style.gridColor} strokeDasharray="3 3" />
      )}
      {style.showXAxis && (
        <XAxis
          dataKey="label"
          stroke={style.axisColor}
          tick={{ fill: style.labelColor, fontSize: style.fontSize }}
        />
      )}
      {style.showYAxis && (
        <YAxis
          stroke={style.axisColor}
          tick={{ fill: style.labelColor, fontSize: style.fontSize }}
        />
      )}
    </>
  );

  const legend = style.showLegend ? (
    <Legend
      verticalAlign={
        style.legendPosition === "top" || style.legendPosition === "bottom"
          ? style.legendPosition
          : "bottom"
      }
      align={
        style.legendPosition === "left"
          ? "left"
          : style.legendPosition === "right"
            ? "right"
            : "center"
      }
      wrapperStyle={{ color: style.legendColor, fontSize: style.fontSize }}
    />
  ) : null;

  const valueLabels = style.showLabels ? (
    <LabelList
      dataKey="value"
      position="top"
      fill={style.labelColor}
      fontSize={style.fontSize}
    />
  ) : null;

  let chart: React.ReactNode;
  if (block.chartKind === "pie" || block.chartKind === "doughnut") {
    chart = (
      <PieChart>
        <Pie
          data={points}
          dataKey="value"
          nameKey="label"
          cx="50%"
          cy="50%"
          outerRadius="75%"
          innerRadius={block.chartKind === "doughnut" ? "45%" : 0}
          isAnimationActive={style.animation}
          animationDuration={animationDuration}
          label={style.showLabels}
        >
          {points.map((point, index) => (
            <Cell
              key={`${point.label}-${index}`}
              fill={palette[index % palette.length]}
            />
          ))}
        </Pie>
        {legend}
        <Tooltip />
      </PieChart>
    );
  } else if (block.chartKind === "radar") {
    chart = (
      <RadarChart data={points}>
        <PolarGrid stroke={style.gridColor} />
        <PolarAngleAxis
          dataKey="label"
          tick={{ fill: style.labelColor, fontSize: style.fontSize }}
        />
        <Radar
          dataKey="value"
          stroke={style.primaryColor}
          fill={style.primaryColor}
          fillOpacity={0.45}
          isAnimationActive={style.animation}
          animationDuration={animationDuration}
        />
        {legend}
        <Tooltip />
      </RadarChart>
    );
  } else if (block.chartKind === "line") {
    chart = (
      <LineChart {...common}>
        {axes}
        <Line
          type="monotone"
          dataKey="value"
          stroke={style.primaryColor}
          strokeWidth={2.5}
          dot={{ fill: style.primaryColor }}
          isAnimationActive={style.animation}
          animationDuration={animationDuration}
        >
          {valueLabels}
        </Line>
        {legend}
        <Tooltip />
      </LineChart>
    );
  } else if (block.chartKind === "area") {
    chart = (
      <AreaChart {...common}>
        {axes}
        <Area
          type="monotone"
          dataKey="value"
          stroke={style.primaryColor}
          fill={style.primaryColor}
          fillOpacity={0.35}
          isAnimationActive={style.animation}
          animationDuration={animationDuration}
        >
          {valueLabels}
        </Area>
        {legend}
        <Tooltip />
      </AreaChart>
    );
  } else {
    chart = (
      <BarChart {...common}>
        {axes}
        <Bar
          dataKey="value"
          fill={style.primaryColor}
          radius={[4, 4, 0, 0]}
          isAnimationActive={style.animation}
          animationDuration={animationDuration}
        >
          {valueLabels}
        </Bar>
        {legend}
        <Tooltip />
      </BarChart>
    );
  }

  return (
    <div
      data-block-id={block.id}
      style={blockFrame(block, {
        opacity: block.opacity,
        background: style.background,
        borderRadius: style.borderRadius,
        padding: style.padding,
        boxSizing: "border-box",
        overflow: "hidden",
      })}
    >
      {block.title && (
        <div
          style={{
            position: "absolute",
            top: style.padding,
            left: style.padding,
            right: style.padding,
            zIndex: 1,
            color: style.labelColor,
            fontFamily: style.fontFamily,
            fontSize: Math.max(style.fontSize + 2, 12),
            fontWeight: style.fontWeight,
            textAlign: "center",
          }}
        >
          {block.title}
        </div>
      )}
      <ResponsiveContainer width="100%" height="100%">
        {chart as React.ReactElement}
      </ResponsiveContainer>
    </div>
  );
});

export default ChartRenderer;
