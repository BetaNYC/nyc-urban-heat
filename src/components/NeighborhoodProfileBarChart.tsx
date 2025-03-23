import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

import { nta_dataset_info, out_door_heat_index } from "../App";
import ntaFeatureCollection from "../data/nta.geo.json";

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
    metric: "NTA_PCT_MRT_Less_Than_110" | "PCT_TREES" | "PCT_AREA_COOLROOF" | "PCT_PERMEABLE" | 'Outdooor_Heat_Volnerability_Index' | "SURFACETEMP"
};

const NeighborhoodProfileBarChart = ({ data, valueAverage, boro, metric }: Props) => {
    const svgRef = useRef<SVGSVGElement>(null);


    const renderChart = () => {
        if (!svgRef.current) return;

        const { width, height } = svgRef.current.getBoundingClientRect();
        const tooltip = document.getElementById("tooltip");

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
        // .text("Neighborhood Tree Canopy Profile");

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
            .domain(metric === 'Outdooor_Heat_Volnerability_Index' ? [0, 5] : metric === 'SURFACETEMP' ? [80, 105] : [0, 80])
            .nice()
            .range([innerHeight, 0]);

        // chart
        //     .append("text")
        //     .attr("transform", "rotate(-90)")
        //     .attr("x", -199)
        //     .attr("y", -margin.left + 21)
        //     .style("font-size", "12px")
        //     .style("fill", "#ababab")
        //     .text("Percentage area of tree canopy");

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
            case "Outdooor_Heat_Volnerability_Index":
                colorPalette = ["#faebc5", "#e8a98b", "#d66852", "#943d33", "#511314"]
                colorDomain = [0, 1, 2, 3, 4]
                break;
            case "SURFACETEMP":
                colorPalette = ["#f4e0d7", "#cbada6", "#a37a76", "#7a4645", "#511314"]
                colorDomain = [80.8, 92.1, 93.3, 94.4, 95.7]
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
            //@ts-ignore
            .call(d3.axisLeft(yScale).tickValues(
                metric === 'Outdooor_Heat_Volnerability_Index' ? [0, 1, 2, 3, 4, 5] : metric === 'SURFACETEMP' ? [80, 84, 88, 92, 96, 100] : [0, 10, 20, 30, 40, 50, 60, 70, 80]
                //@ts-ignore
            ).tickFormat((d) => metric === 'Outdooor_Heat_Volnerability_Index' ? d : metric === 'SURFACETEMP' ? d + "°F" : d + "%"))
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


        let hoveredOutDoorHeatIndexClass = 0;
        let hoveredMRTClass = 0;
        let hoveredTreeCanopyClass = 0;
        let hoveredSurfaceTemperatureClass = 0;
        let hoveredCoolRoofsClass = 0;
        let hoveredPermeableSurfaceClass = 0;


        const outDoorHeatIndexTextLevelHandler = (
            hoveredOutDoorHeatIndexClass: number
        ) => {
            switch (true) {
                case hoveredOutDoorHeatIndexClass < 1:
                    return "low";
                case hoveredOutDoorHeatIndexClass < 2:
                    return "med-low";
                case hoveredOutDoorHeatIndexClass < 3:
                    return "med";
                case hoveredOutDoorHeatIndexClass < 4:
                    return "med-high";
                case hoveredOutDoorHeatIndexClass <= 5:
                    return "high";
                default:
                    return "unknown";
            }
        };


        chart
            .selectAll(".bar")
            .data(displayedBars)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", (_, i) => innerWidth - (i + 1) * (barWidth + barSpacing)) // 从右到左排列
            .attr("y", innerHeight)
            .attr("width", barWidth)
            .attr("height", 0)
            .attr("fill", (d) => colorScale(d.value))
            .on("mousemove", (event, index) => {
                const [xPos, yPos] = d3.pointer(event, svgRef.current);
                const ntacode = index.neighborhood
                // @ts-ignore
                const ntaFeatures = ntaFeatureCollection.features
                // @ts-ignore
                const ntaname = ntaFeatures.filter(f => f.properties.ntacode === ntacode)[0].properties.ntaname
                // @ts-ignore
                const boroname = ntaFeatures.filter(f => f.properties.ntacode === ntacode)[0].properties.boroname
                const color = event.target.getAttribute('fill')

                if (out_door_heat_index.value.length) {
                    const hoveredNeighbohoodNTAMetrics = out_door_heat_index.value.filter(
                        (d) => d.ntacode === ntacode
                    )[0];

                    //@ts-ignore
                    hoveredOutDoorHeatIndexClass = (+hoveredNeighbohoodNTAMetrics[
                        "Outdooor_Heat_Volnerability_Index"
                    ]).toFixed(1);
                    hoveredMRTClass = +hoveredNeighbohoodNTAMetrics["MRT_class"];
                    hoveredTreeCanopyClass =
                        +hoveredNeighbohoodNTAMetrics["pct_tree_class"];
                    hoveredSurfaceTemperatureClass =
                        +hoveredNeighbohoodNTAMetrics["RelativeST_class"];
                    hoveredCoolRoofsClass =
                        +hoveredNeighbohoodNTAMetrics["cool_roof_class"];
                    hoveredPermeableSurfaceClass =
                        +hoveredNeighbohoodNTAMetrics["Permeable_class"];
                    hoveredSurfaceTemperatureClass =
                        +hoveredNeighbohoodNTAMetrics["RelativeST_class"];
                }

                const title = `<div class="flex items-end gap-4 px-[1rem]  text-[#FFF] rounded-t-[0.75rem]" style="background-color: ${color}">
                                <div class="flex flex-col justify-between items-center ">
                                    <div class="font-bold text-[16px] ">${metric === "PCT_AREA_COOLROOF"
                        ? `${hoveredCoolRoofsClass}.0` : metric === "NTA_PCT_MRT_Less_Than_110"
                            ? `${hoveredMRTClass}.0` : metric === "PCT_PERMEABLE"
                                ? `${hoveredPermeableSurfaceClass}.0` : metric === "PCT_TREES"
                                    ? `${hoveredTreeCanopyClass}.0` : metric === "SURFACETEMP"
                                        ? `${hoveredSurfaceTemperatureClass}.0`
                                        : ""}
                                    </div>
                                    <div class="font-regular text-[10px] leading-none">
                                        ${metric === "PCT_AREA_COOLROOF" ? outDoorHeatIndexTextLevelHandler(hoveredCoolRoofsClass)
                        : metric === "NTA_PCT_MRT_Less_Than_110"
                            ? outDoorHeatIndexTextLevelHandler(hoveredMRTClass)
                            : metric === "PCT_PERMEABLE"
                                ? outDoorHeatIndexTextLevelHandler(hoveredPermeableSurfaceClass)
                                : metric === "PCT_TREES"
                                    ? outDoorHeatIndexTextLevelHandler(hoveredTreeCanopyClass)
                                    : metric.includes("ST_20")
                                        ? outDoorHeatIndexTextLevelHandler(hoveredSurfaceTemperatureClass)
                                        : ""}
                                    </div>
                                </div>
                                <div>
                                  <h1 class='mb-1 font-bold text-[0.8rem] leading-tight'>${ntaname}</h1>
                                  <h1 class='font-medium text-[0.5rem] leading-none'>${boroname} <span class="font-medium text-[0.75rem]">${ntacode}</span></h1>
                              </div>
                            </div>`;

                const outdoorHeatExposureIndexTitle = `
                            <div class="flex items-center gap-4 px-[1rem] pt-[0.75rem] pb-[0.5rem] rounded-t-[0.75rem] text-[#FFF]" style="background-color: ${color};">
                                                      <div class="flex flex-col justify-between items-center">
                                                        <div class="font-bold text-[18px] ">${hoveredOutDoorHeatIndexClass}</div>
                                                        <div class="font-regular text-[10px] leading-none">${outDoorHeatIndexTextLevelHandler(
                    hoveredOutDoorHeatIndexClass
                )}</div>
                                                      </div>
                      
                                                    <div>
                                                        <h1 class='mb-1 font-bold text-[1rem] leading-none'>${ntaname}</h1>
                                                        <h1 class='font-medium text-[0.75rem] leading-none'>${boroname} <span class="font-medium text-[0.75rem]">${ntacode}</span></h1>
                                                    </div>
                                                </div>
                            `;

                const details = `<div class="flex flex-col gap-[0.75rem] px-[1rem] pt-[1rem] pb-[1rem] max-w-[360px] bg-[#333] rounded-b-[0.75rem]">
                                    <div class="flex items-start gap-3">
                                        <div class="flex flex-col items-center px-[0.625rem] py-[0.25rem] leading-tight" style="background-color:${color}">
                                            <div class='font-bold text-[12px] text-white'>${Math.round(index.value)} ${metric === 'SURFACETEMP' ? "°F" : "%"} </div>
                                        </div>
                                        <div class="font-semibold text-[0.75rem] text-white whitespace-nowrap">
                                         ${metric === "PCT_AREA_COOLROOF"
                        ? "Area of buildings with cool roofs"
                        : metric === "NTA_PCT_MRT_Less_Than_110"
                            ? "Outdoor area with thermal comfort"
                            : metric === "PCT_PERMEABLE"
                                ? "Area with permeable surfaces"
                                : metric === "PCT_TREES"
                                    ? "Area covered by tree canopy"
                                    : "Average Surface Temperature"
                    }                    
                                        </div>
                                    </div>
                                </div>`;

                const outdoorHeatExposureIndexDetails = `
                                <div class="flex flex-col gap-[0.75rem] px-[1rem] pt-[0.5rem] py-[1rem] max-w-[360px] font-regular text-white bg-[#333] rounded-b-[0.75rem]">
                                  <div class="flex items-center gap-4">
                                    <div 
                                      class="flex justify-center items-center w-[20px] h-8 font-medium text-[8px] bg-[#C68165] border-[1px] border-white" 
                                      style="background-color: ${color};">
                                      ${hoveredMRTClass}
                                    </div>
                                    <div>
                                        <div class="text-[14px] text-white">Mean Radiant Temperature</div>
                                    </div>
                                  </div>
                                  <div class="flex items-center gap-4">
                                    <div 
                                      class="flex justify-center items-center w-[20px] h-8 font-semibold text-[8px] bg-[#F4E0D7] border-[1px] border-white" 
                                      style="background-color: ${color}};">
                                      ${hoveredSurfaceTemperatureClass}
                                    </div>
                                    <div>
                                        <div class="text-[14px] text-white">Surface Temperature</div>
                                    </div>
                                  </div>
                                  <div class="flex items-center gap-4">
                                    <div 
                                      class="flex justify-center items-center w-[20px] h-8 font-semibold text-[8px] bg-[#D2D4D8] border-[1px] border-white" 
                                      style="background-color: ${color};
                                           ">
                                      ${hoveredCoolRoofsClass}
                                    </div>
                                    <div>
                                        <div class="text-[14px] text-white">Cool Roofs</div>
                                    </div>
                                
                                  </div>
                                  <div class="flex items-center gap-4">
                                    <div 
                                      class="flex justify-center items-center w-[20px] h-8 font-semibold text-[8px] bg-[#5C7D86] border-[1px] border-white" 
                                      style="background-color: ${color};
                                             ">
                                      ${hoveredTreeCanopyClass}
                                    </div>
                                    <div>
                                        <div class="text-[14px] text-white">Tree Canopy</div>

                                    </div>
                                  </div>
                                  <div class="flex items-center gap-4">
                                    <div 
                                      class="flex justify-center items-center w-[20px] h-8 font-semibold text-[8px] bg-[#F3D9B1] border-[1px] border-white" 
                                      style="background-color: ${color};">
                                      ${hoveredPermeableSurfaceClass}
                                    </div>
                                    <div>
                                        <div class="text-[14px] text-white">Permable Surfaces</div>
                                    </div>    
                                  </div>
                                </div>
                                      `;

                tooltip!.innerHTML = metric === "Outdooor_Heat_Volnerability_Index"
                    ? outdoorHeatExposureIndexTitle
                    : title + details;

                    const tooltipEl = tooltip!;
                    const tooltipRect = tooltipEl.getBoundingClientRect();
                    const containerWidth = svgRef.current?.clientWidth || window.innerWidth;
                    const tooltipWidth = tooltipRect.width;
                    const tooltipHeight = tooltipRect.height;
                
                    let tooltipLeft = xPos + 10;
                    let tooltipTop = yPos - tooltipHeight / 2;
                
                    // 如果碰到右邊邊緣，往左顯示
                    if (xPos + tooltipWidth + 20 > containerWidth) {
                        tooltipLeft = xPos - tooltipWidth - 10;
                    }
                

                
                    tooltipEl.style.left = `${tooltipLeft}px`;
                    tooltipEl.style.top = `${tooltipTop}px`;

                tooltip!.classList.remove("hidden");
            })
            .on("mouseleave", () => {
                document.getElementById("tooltip")?.classList.add("hidden");
            })

            .transition() // 添加过渡动画
            .duration(800) // 动画持续时间（以毫秒为单位）
            .ease(d3.easeCubicOut) // 使用缓动函数
            .attr("y", (d) => yScale(d.value)) // 最终状态：柱子的顶部在正确的 y 位置
            .attr("height", (d) => innerHeight - yScale(d.value)) // 最终高度为正确值

        chart
            .selectAll(".bar_text")
            .data(sortedData)
            .enter()
            .append("text")
            .attr("class", "bar-label")
            .attr("y", (_, i) => innerWidth - (i + 1) * (barWidth + barSpacing) + barWidth * 0.8)// 将文本放置在柱的中间
            .attr("x", metric === "SURFACETEMP" ? -yScale(80) - 18 : -yScale(0) - 18)
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
            .attr("y", (valueAverage.NY) > (valueAverage.boro) || (valueAverage.NY) === (valueAverage.boro)
                ? yScale(valueAverage.NY) - 8
                : yScale(valueAverage.NY) + 14)
            .style("font-size", "12px")
            .style("fill", "#cccccb")
            .style("font-weight", "semibold")
            .text(metric === 'Outdooor_Heat_Volnerability_Index' ? `${valueAverage.NY} New York City Average` : `${valueAverage.NY} New York City Average`);

        chart
            .append("text")
            .attr("x", 12)
            .attr("y", (valueAverage.boro) > (valueAverage.NY)
                ? yScale(valueAverage.boro) - 8
                : yScale(valueAverage.boro) + 14)
            .style("font-size", "12px")
            .style("fill", "#cccccb")
            .style("font-weight", "semibold")
            .text(metric === 'Outdooor_Heat_Volnerability_Index' ? `${valueAverage.boro} ${boro} Average` : `${valueAverage.boro} ${boro} Average`);
    }

    useEffect(() => {
        renderChart();

        const handleResize = () => renderChart();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [data]);


    return (
        <div className="relative w-full h-full">
            <svg className="w-full h-[80%]" ref={svgRef} />;
            <div id="tooltip" className="hidden absolute rounded shadow-md pointer-events-none" />
        </div>
    )



};

export default NeighborhoodProfileBarChart;
