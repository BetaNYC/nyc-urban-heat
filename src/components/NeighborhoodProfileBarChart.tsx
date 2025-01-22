import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

type Props = {
    data: { neighborhood: string; value: number }[];
    isActive?: boolean;
    clickHandler?: () => void;
    size: { width: number; height: number };
    valueAverage: {
        NY: number,
        boro: number
    },
    boro: "Brooklyn" | "Queens" | "Manhattan" | "Staten Island" | "Bronx",
    metric: "NTA_PCT_MRT_Less_Than_110" | "PCT_TREES" | "PCT_AREA_COOLROOF" | "PCT_PERMEABLE"
};

const NeighborhoodProfileBarChart = ({ data, valueAverage, boro, metric }: Props) => {
    const svgRef = useRef<SVGSVGElement>(null);


    useEffect(() => {
        if (!svgRef.current) return;

        const { width, height } = svgRef.current.getBoundingClientRect();

        const margin = { top: 10, right: 20, bottom: 50, left: 65 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        d3.select(svgRef.current).selectAll("*").remove();

        const svg = d3
            .select(svgRef.current)
            .attr("width", width)
            .attr("height", height);


        svg
            .append("text")
            .attr("x", margin.left)
            .attr("y", margin.top - 10)
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .style("fill", "#333")
            .text("Neighborhood Tree Canopy Profile");

        const chart = svg
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);


        const barWidth = (innerWidth - 3 * 58) / 58;
        const barSpacing = 3;
        const totalBarWidth = barWidth + barSpacing;


        const sortedData = [...data].sort((a, b) => b.value - a.value);


        const maxBars = Math.floor(innerWidth / (barWidth + barSpacing));
        const displayedBars = sortedData.slice(0, maxBars);

        const xScale = d3
            .scaleBand()
            .domain(displayedBars.map((d) => d.neighborhood))
            .range([0, innerWidth])
            .padding(0.1);


        const yScale = d3
            .scaleLinear()
            .domain([0, 80])
            .nice()
            .range([innerHeight, 0]);

        chart
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -199)
            .attr("y", -margin.left + 21)
            .style("font-size", "12px")
            .style("fill", "#ababab")
            .text("Percentage area of tree canopy");

            let colorPalette, colorDomain;

            switch (metric) {
                case "NTA_PCT_MRT_Less_Than_110":
                  colorPalette = ["#B8613F", "#C68165", "#D4A08C", "#E3C0B2", "#F1DFD9"]; 
                  colorDomain = [27, 30, 34, 44, 62]; 
                  break;
                case "PCT_TREES":
                  colorPalette = ["#3F7481", "#5A828E", "#859EA4", "#ADBEC3", "#D6DFE1"]; 
                  colorDomain = [14, 17, 20, 24, 50]; 
                  break;
                case "PCT_AREA_COOLROOF":
                  colorPalette = ["#2D5185", "#526B8F", "#818FA4", "#A4ADBA", "#D2D6DC"]; 
                  colorDomain = [20, 37, 47, 55, 76]; 
                  break;
                case "PCT_PERMEABLE":
                  colorPalette = ["#8F6018", "#C8892B", "#E7B263", "#EDC58A", "#F3D9B1"]; 
                  colorDomain = [4, 6, 10, 20, 71];
                  break;
                default:
                  colorPalette = ["#841F21", "#8E4B4A", "#A87E7A", "#CBADA6", "#F4E0D7"]; 
                  colorDomain = [93.3, 92.1, 80, 94.4, 95.7]; 
                  break;
              }





        const colorScale = d3
            .scaleThreshold()
            .domain(colorDomain)
            //@ts-ignore
            .range(colorPalette);


        chart
            .append("g")
            .call(d3.axisLeft(yScale).tickValues([0, 10, 20, 30, 40, 50, 60, 70, 80]).tickFormat((d) => d + "%"))
            .selectAll("text")
            .style("font-size", "10px")
            .style("fill", "#ababab");

        chart.selectAll(".tick line").style("stroke", "#ababab");

        chart.selectAll(".domain").remove();

        chart.append("line")
            .attr("x1", 0)  // 起始位置
            .attr("y1", innerHeight)  // 结束位置的 y 坐标
            .attr("x2", innerWidth)  // 结束位置
            .attr("y2", innerHeight)  // y 值保持一致，确保它位于 x 轴下方
            .attr("stroke", "#ababab")  // 线的颜色
            .attr("stroke-width", 1);  // 线的宽度


        chart
            .selectAll(".bar")
            .data(displayedBars)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", (_, i) => innerWidth - (i + 1) * (barWidth + barSpacing)) // 从右到左排列
            .attr("y", innerHeight) // 初始状态：柱子的顶部在 x 轴
            .attr("width", barWidth)
            .attr("height", 0) // 初始高度为 0
            .attr("fill", (d) => colorScale(d.value))
            .transition() // 添加过渡动画
            .duration(800) // 动画持续时间（以毫秒为单位）
            .ease(d3.easeCubicOut) // 使用缓动函数
            .attr("y", (d) => yScale(d.value)) // 最终状态：柱子的顶部在正确的 y 位置
            .attr("height", (d) => innerHeight - yScale(d.value)); // 最终高度为正确值

        chart
            .selectAll(".bar_text")
            .data(sortedData)
            .enter()
            .append("text")
            .attr("class", "bar-label")
            .attr("y", (_, i) => innerWidth - (i + 1) * (barWidth + barSpacing) + barWidth * 0.8)// 将文本放置在柱的中间
            .attr("x", -yScale(0) - 18)
            .attr("transform", "rotate(-90)") // 按照你原来的要求旋转文本
            .style("font-size", "9px")
            .style("text-anchor", 'middle')
            .style("fill", "#ababab")
            .text((d) => `${d.neighborhood}`); // 显示 neighborhood 名称

        const thresholdValues = [valueAverage.NY, valueAverage.boro];

        thresholdValues.forEach((value) => {
            chart
                .append("line")
                .attr("x1", 0)
                .attr("x2", innerWidth)
                .attr("y1", yScale(value))
                .attr("y2", yScale(value))
                .attr("stroke", "gray")
                .attr("stroke-width", 1)
                .attr("stroke-dasharray", "2 2");
        });

        chart
            .append("text")
            .attr("x", 12)
            .attr("y", (valueAverage.NY) > (valueAverage.boro)
                ? yScale(valueAverage.NY) - 8
                : yScale(valueAverage.NY) + 14)
            .style("font-size", "12px")
            .style("fill", "#cccccb")
            .style("font-weight", "semibold")
            .text(`${valueAverage.NY}% New York City Average`);

        chart
            .append("text")
            .attr("x", 12)
            .attr("y", (valueAverage.boro) > (valueAverage.NY)
                ? yScale(valueAverage.boro) - 8
                : yScale(valueAverage.boro) + 14)
            .style("font-size", "12px")
            .style("fill", "#cccccb")
            .style("font-weight", "semibold")
            .text(`${valueAverage.boro}% ${boro} Average`);
    }, [data]);

    return <svg className="w-full h-[80%]" ref={svgRef} />;
};

export default NeighborhoodProfileBarChart;
