"use client";

import React, { memo } from "react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, LabelList, Legend,
  Line, LineChart, Pie, PieChart, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from "recharts";
import { ChartData } from "@/app/Store/editorStore";

const ChartRenderer = memo(({ data }: { data: ChartData }) => {
  const { style } = data;
  const colors = [style.primaryColor, style.secondaryColor, "#22c55e", "#f59e0b", "#ec4899"];
  const common = { data: data.data, margin: { top: data.title ? 26 : 8, right: 12, bottom: 8, left: 4 } };
  const axes = <>
    {style.showGrid && <CartesianGrid stroke={style.gridColor} strokeDasharray="3 3" />}
    {style.showXAxis && <XAxis dataKey="label" stroke={style.axisColor} tick={{ fill: style.labelColor, fontSize: style.fontSize }} />}
    {style.showYAxis && <YAxis stroke={style.axisColor} tick={{ fill: style.labelColor, fontSize: style.fontSize }} />}
  </>;
  const legend = style.showLegend ? <Legend verticalAlign={style.legendPosition === "top" || style.legendPosition === "bottom" ? style.legendPosition : "bottom"} align={style.legendPosition === "left" ? "left" : style.legendPosition === "right" ? "right" : "center"} wrapperStyle={{ color: style.legendColor, fontSize: style.fontSize }} /> : null;
  const animation = style.animation ? style.animationDuration : 0;
  const label = style.showLabels ? <LabelList dataKey="value" position="top" fill={style.labelColor} fontSize={style.fontSize} /> : null;

  let chart: React.ReactNode;
  if (data.chartType === "pie" || data.chartType === "doughnut") {
    chart = <PieChart><Pie data={data.data} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius="75%" innerRadius={data.chartType === "doughnut" ? "45%" : 0} isAnimationActive={style.animation} animationDuration={animation} label={style.showLabels}>{data.data.map((point, index) => <Cell key={`${point.label}-${index}`} fill={colors[index % colors.length]} />)}</Pie>{legend}<Tooltip /></PieChart>;
  } else if (data.chartType === "radar") {
    chart = <RadarChart data={data.data}><PolarGrid stroke={style.gridColor} /><PolarAngleAxis dataKey="label" tick={{ fill: style.labelColor, fontSize: style.fontSize }} /><Radar dataKey="value" stroke={style.primaryColor} fill={style.primaryColor} fillOpacity={0.45} isAnimationActive={style.animation} animationDuration={animation} />{legend}<Tooltip /></RadarChart>;
  } else if (data.chartType === "line") {
    chart = <LineChart {...common}>{axes}<Line type="monotone" dataKey="value" stroke={style.primaryColor} strokeWidth={2.5} dot={{ fill: style.primaryColor }} isAnimationActive={style.animation} animationDuration={animation}>{label}</Line>{legend}<Tooltip /></LineChart>;
  } else if (data.chartType === "area") {
    chart = <AreaChart {...common}>{axes}<Area type="monotone" dataKey="value" stroke={style.primaryColor} fill={style.primaryColor} fillOpacity={0.35} isAnimationActive={style.animation} animationDuration={animation}>{label}</Area>{legend}<Tooltip /></AreaChart>;
  } else {
    chart = <BarChart {...common}>{axes}<Bar dataKey="value" fill={style.primaryColor} radius={[4, 4, 0, 0]} isAnimationActive={style.animation} animationDuration={animation}>{label}</Bar>{legend}<Tooltip /></BarChart>;
  }
  return <div style={{ width: "100%", height: "100%", pointerEvents: "none", position: "relative", background: style.background, borderRadius: style.borderRadius, padding: style.padding, boxSizing: "border-box", overflow: "hidden" }}>
    {data.title && <div style={{ position: "absolute", top: style.padding, left: style.padding, right: style.padding, zIndex: 1, color: style.labelColor, fontFamily: style.fontFamily, fontSize: Math.max(style.fontSize + 2, 12), fontWeight: style.fontWeight, textAlign: "center" }}>{data.title}</div>}
    <ResponsiveContainer width="100%" height="100%">{chart as React.ReactElement}</ResponsiveContainer>
  </div>;
});

ChartRenderer.displayName = "ChartRenderer";
export default ChartRenderer;
