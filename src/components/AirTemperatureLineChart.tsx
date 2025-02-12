import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { selectedDataset, clickedAddress } from '../pages/MapPage';

import { WeatherStationData } from '../types';

interface AirTemperatureData {
    address: string;
    datetime: Date;
    year: number;
    tempmax: number;
    tempmin: number;
    Normal_Temp_Max: number;
    Normal_Temp_Min: number;
}

type Props = {
    data: AirTemperatureData[]
}


const AirTemperatureLineChart = ({ data }: Props) => {

    const svgRef = useRef<SVGSVGElement | null>(null);
    const renderChart = () => {
        const parseDate = d3.timeParse('%Y-%m-%d');

        const currentYear = selectedDataset.value?.currentYear;

        const svgElement = svgRef.current;
        if (!svgElement) return;


        const margin = { top: 15, right: 15, bottom: 40, left: 40 };
        const width = svgElement.clientWidth
        const height = svgElement.clientHeight

        const svg = d3.select(svgElement)
            .attr('width', width)
            .attr('height', height);;

        svg.selectAll('*').remove();

        const x = d3.scaleTime()
            .domain([
                parseDate(`${currentYear}-05-01`) as Date,
                parseDate(`${currentYear}-10-01`) as Date
            ] as [Date, Date])
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain([30, 120])
            .range([height - margin.bottom, margin.top]);

        const tickDates = Array.from({ length: 6 }, (_, i) => parseDate(`${currentYear}-${String(i + 5).padStart(2, '0')}-01`));

        svg.append('text')
            .attr('x', -margin.top) // X position
            .attr('y', 12) // Y position
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)") // Center text horizontally
            .text('Heat Index (℉)') // Set label text
            .style('font-size', '12px') // Adjust font size
            .style('fill', '#ccc'); // Adjust text color

        svg.append('text')
            .attr('x', width - margin.right - 24)
            .attr('y', height - margin.bottom / 4)
            .text('Date')
            .style('font-size', '12px') // Adjust font size
            .style('fill', '#ccc'); // Adjust text color


        const xAxis = svg.append("g")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            //@ts-ignore
            .call(d3.axisBottom(x)
                //@ts-ignore
                .tickValues(tickDates)
                //@ts-ignore
                .tickFormat(d3.timeFormat("%b %d"))
            );

        xAxis.selectAll("path, line")
            .attr("stroke", "#999")
            .attr("stroke-width", 0.25);

        xAxis.selectAll("text")
            .attr("fill", "#999")
            .attr("stroke-width", 0);

        const xGrid = svg.append("g")
            .attr("class", "x-grid")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(d3.axisBottom(x)
                .tickSize(-height + margin.top + margin.bottom)
                .tickFormat(() => "") // Hide tick text for grid lines
            );

        xGrid.selectAll(".tick line")
            .attr("stroke", "#999")
            .attr("stroke-width", 0.25);

        const yAxis = svg.append("g")
            .attr("transform", `translate(${margin.left}, 0)`)
            .attr("class", "grid")
            .call(d3.axisLeft(y)
                .tickSize(-width + margin.left + margin.right)
            )
            .attr("stroke-width", 0.25);

        yAxis.selectAll("path, line")
            .attr("stroke", "#999")
            .attr("stroke-width", 0.25);

        yAxis.selectAll("text")
            .attr("fill", "#999")
            .attr("stroke-width", 0);

        const lineMax = d3.line<{ datetime: Date, tempmax: number }>()
            .x(d => x(d.datetime))
            .y(d => y(d.tempmax));

        const lineNormalMax = d3.line<{ datetime: Date, Normal_Temp_Max: number }>()
            .x(d => x(d.datetime))
            .y(d => y(d.Normal_Temp_Max));

        const lineMin = d3.line<{ datetime: Date, tempmin: number }>()
            .x(d => x(d.datetime))
            .y(d => y(d.tempmin));

        const lineNormalMin = d3.line<{ datetime: Date, Normal_Temp_Min: number }>()
            .x(d => x(d.datetime))
            .y(d => y(d.Normal_Temp_Min));

        svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#EE745D')
            .attr('stroke-width', 1.5)
            .attr('d', lineMax as unknown as string);

        svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#E59E88')
            .attr('stroke-width', 1.5)
            .attr('stroke-dasharray', '2,2')
            .attr('d', lineNormalMax as unknown as string);

        svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#49808D')
            .attr('stroke-width', 1.5)
            .attr('d', lineMin as unknown as string);

        svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#7A8A94')
            .attr('stroke-width', 1.5)
            .attr('stroke-dasharray', '2,2')
            .attr('d', lineNormalMin as unknown as string);

        const verticalLine = svg.append('line')
            .attr('stroke', '#F2F2F2')
            .attr('stroke-width', 1)
            .style('pointer-events', 'none');

        const tooltipDiv = d3.select('#tooltip')
            .style('position', 'absolute')
            .style('background', '#4F4F4F')
            .style('border-radius', '12px')
            .style('display', 'none');

        svg.on('mousemove', (event) => {
            const [xPos, yPos] = d3.pointer(event, svgRef.current);
            const xDate = x.invert(xPos);
            const xOffset = 15

            const closestDataPoint = data.reduce((prev, curr) =>
                Math.abs(xDate.getTime() - curr.datetime!.getTime()) < Math.abs(xDate.getTime() - prev.datetime!.getTime())
                    ? curr : prev);

            verticalLine
                .attr('x1', x(closestDataPoint.datetime!))
                .attr('x2', x(closestDataPoint.datetime!))
                .attr('y1', margin.top)
                .attr('y2', height - margin.bottom)
                .style('display', 'block');

            const svgWidth = (svg.node() as SVGSVGElement).getBoundingClientRect().width;
            const tooltipWidth = (tooltipDiv.node() as HTMLElement).getBoundingClientRect().width;
            const isNearRightEdge = xPos + tooltipWidth + xOffset > svgWidth;

            const isAboveHistoricalMax = Math.round(closestDataPoint.tempmax) - Math.round(closestDataPoint.Normal_Temp_Max) > 0
            const isAboveHistoricalMin = Math.round(closestDataPoint.tempmax) - Math.round(closestDataPoint.Normal_Temp_Max) > 0

            const tempMaxDifference = Math.abs(Math.round(closestDataPoint.tempmax) - Math.round(closestDataPoint.Normal_Temp_Max))
            const tempMinDifference = Math.abs(Math.round(closestDataPoint.tempmin) - Math.round(closestDataPoint.Normal_Temp_Min))

            tooltipDiv
                .style('left', isNearRightEdge ? `${xPos - tooltipWidth - xOffset}px` : `${xPos + xOffset}px`)
                .style('top', `${yPos}px`)
                .style('display', 'block')
                .html(`
                <div>
                    <div style="padding:4px 8px 4px 8px; font-weight:medium; font-size:10px; color: #f2f2f2; border-bottom: 1px solid #F2F2F2; border-radius: 12px 12px 0 0">${d3.timeFormat('%b %d, %Y')(closestDataPoint.datetime!)}</div>
                    <div style="margin: 8px; padding:0">
                        <div style="display:flex; align-items: flex-start; gap: 15px; margin-bottom: 12px">
                            <div style="width: 40px;font-weight:bold; font-size: 14px;color: #F76D52;">${Math.round(closestDataPoint.tempmax)} °F</div>
                            <div style="">
                                <h3 style="font-weight: 500; font-size:12px; color:#F2F2F2">Maximum Air Temperature</h3>
                                <div style="display: flex; gap:8px;">
                                    <p class="max-difference" style="width: 28px; font-weight: bold; font-size: 12px; letter-spacing: -1px;" >
                                        ${isAboveHistoricalMax ? "+" : "-"}
                                        ${tempMaxDifference}°
                                    </p>
                                    <p style="font-weight: 500; font-size: 12px;color:#F2F2F2">above Historic normal max</p>
                                </div>
                            </div>
                        </div> 
                        <div style="display:flex; gap: 15px; align-items: flex-start;">
                            <div style="width: 40px; font-weight:bold; font-size: 14px;color: #5298AA;">${Math.round(closestDataPoint.tempmin)} °F</div>
                            <div style="">
                                <h3 style="font-weight: 500; font-size:12px; color:#F2F2F2">Minimum Air Temperature</h3>
                                <div style="display: flex; gap:8px;">
                                    <p class='min-difference' style="width: 28px; font-weight: bold; font-size: 12px; letter-spacing: -1px;">
                                        ${isAboveHistoricalMin ? "+" : "-"}
                                        ${tempMinDifference}°
                                    </p>
                                    <p style="font-weight: 500; font-size: 12px; color:#F2F2F2">above Historic normal min</p>
                                </div>
                            </div>
                        </div>       
                    </div>
                </div>
            `);
            tooltipDiv.selectAll('.max-difference').style('color', isAboveHistoricalMax ? '#e19f3c' : '#F2F2F2')
            tooltipDiv.selectAll('.min-difference').style('color', isAboveHistoricalMin ? '#e19f3c' : '#F2F2F2')

            const tooltipElement = tooltipDiv.node() as HTMLElement;
            if (tooltipElement) {
                const tooltipHeight = tooltipElement.getBoundingClientRect().height;
                tooltipDiv.style('top', `${yPos - tooltipHeight / 2}px`);
            }

        })
            .on('mouseout', () => {
                verticalLine.style('display', 'none');
                tooltipDiv.style('display', 'none');
            });
    };

    useEffect(() => {
        renderChart();

        const handleResize = () => renderChart();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize); // Clean up listener
        };
    }, [data]); // Re-run when currentYear changes

    return (
        <div className='relative w-full h-[80%] overflow-x-hidden'>
            <svg ref={svgRef} className='w-full h-full'></svg>
            <div id='tooltip' style={{ position: 'absolute', display: 'none' }}></div>
        </div>
    );
};



export default AirTemperatureLineChart