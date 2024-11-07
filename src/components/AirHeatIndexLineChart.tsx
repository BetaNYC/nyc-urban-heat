import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { selectedDataset, clickedAddress } from '../pages/MapPage';

interface AirHeatIndexData {
    address: string;
    datetime: Date;
    year: number;
    feelslikemax: number;
    feelslikemin: number;
    NYC_HeatEvent: "" | "NYC_Heat_Event";
    HeatAdvisory: "" | "HeatAdvisory";
    ExcessiveHeat: "" | "Excessive_Heat_Event";
}

type Props = {
    data: AirHeatIndexData[]
}

const AirHeatIndexLineChart = ({ data }: Props) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    const renderChart = () => {

        const parseDate = d3.timeParse('%Y-%m-%d');
        const currentYear = selectedDataset.value?.currentYear

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
            .attr('y', height - margin.bottom / 4 + 3)
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
                .tickFormat(d => d3.timeFormat("%b")(d) + " " + d.getDate())
            );

        xAxis.selectAll("path, line")
            .attr("stroke", "#999")
            .attr("stroke-width", 0.25);

        xAxis.selectAll("text")
            .attr("fill", "#999")
            .attr("stroke-width", 0)
            .attr("transform", "translate(0, 3)");

        xAxis.selectAll("text")
            .filter((_, i) => i === 0)
            .style("text-anchor", "start");

        xAxis.selectAll("text")
            .filter((_, i) => i === xAxis.selectAll("text").size() - 1)  // Select the last label
            .style("text-anchor", "end");

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


        let nycHeatEventDates = data
            .filter(d => d.NYC_HeatEvent !== '')
            .map(d => d.datetime)
            .filter(date => date instanceof Date);
        let heatAdvisoryDates = data
            .filter(d => d.HeatAdvisory !== '')
            .map(d => d.datetime)
            .filter(date => date instanceof Date);
        let excessiveHeatDates = data
            .filter(d => d.ExcessiveHeat === "Excessive_Heat_Event")
            .map(d => d.datetime)
            .filter(date => date instanceof Date);

        const calculateTickWidth = (date: Date) => {
            const oneDay = d3.timeDay.offset(date, -1);
            const nextDay = d3.timeDay.offset(date, 1);

            const xPositionPrev = x(oneDay);
            const xPositionNext = x(nextDay);

            return xPositionNext - xPositionPrev;
        };

        // Width of one tick
        const tickWidth = calculateTickWidth(new Date()); // Calculate based on any date
        const rectangleHeight = height - margin.top - margin.bottom;

        // Width of one part (third of tickWidth)
        const partWidth = tickWidth / 3;

        // Draw rectangles function with offset
        const heatDaysRectsDrawer = (dates: Date[], color: string, partIndex: number, event: string) => {
            dates.forEach(date => {
                if (date) {
                    const xPosition = x(date);

                    // Calculate the offset position for the rectangle
                    const xOffset = xPosition - (tickWidth / 2) + (partIndex * partWidth);

                    svg.append("rect")
                        .attr("x", xOffset)
                        .attr("y", margin.top)
                        .attr("width", partWidth)
                        .attr("height", rectangleHeight)
                        .attr("fill", color)
                        .attr("stroke-width", 0)
                        .on('mousemove', () => {
                            tooltipDiv.style('background', color)
                            tooltipDiv.select('#heat-event') // Use `select` to target the existing div
                                .html(`
                                <div style="padding: 4px 8px; font-weight: bold; font-size: 14px; color: #F2F2F2;">
                                    ${event}
                                </div>
                            `);
                        })
                        .on('mouseout', () => {
                            tooltipDiv.style('background', '#4F4F4F')
                        })
                }
            });
        };

        heatDaysRectsDrawer(nycHeatEventDates, "#AD844A", 0, 'NYC Heat Event');
        heatDaysRectsDrawer(heatAdvisoryDates, "#A46338", 1, 'Heat Advisory');
        heatDaysRectsDrawer(excessiveHeatDates, "#823E35", 2, 'Excessive Heat');

        const lineMax = d3.line<{ datetime: Date, feelslikemax: number }>()
            .x(d => x(d.datetime))
            .y(d => y(d.feelslikemax));

        const lineMin = d3.line<{ datetime: Date, feelslikemin: number }>()
            .x(d => x(d.datetime))
            .y(d => y(d.feelslikemin));

        svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#EE745D')
            .attr('stroke-width', 1.5)
            .attr('d', lineMax as unknown as string);

        svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#49808D')
            .attr('stroke-width', 1.5)
            .attr('d', lineMin as unknown as string);

        const verticalLine = svg.append('line')
            .attr('stroke', '#F2F2F2')
            .attr('stroke-width', 1)
            .style('pointer-events', 'none');

        const tooltipDiv = d3.select('#tooltip')
            .style('position', 'absolute')
            .style('background', '#4F4F4F')
            .style('border', '1px solid #4F4F4F')
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

            tooltipDiv
                .style('left', isNearRightEdge ? `${xPos - tooltipWidth - xOffset}px` : `${xPos + xOffset}px`)
                .style('top', `${yPos}px`)
                .style('display', 'block')
                .html(`
                <div style="">
                    <div style="padding:4px 8px 4px 8px; font-weight:medium; font-size:10px; color: #f2f2f2; border-bottom: 1px solid #F2F2F2; border-radius: 12px 12px 0 0">${d3.timeFormat('%b %d, %Y')(closestDataPoint.datetime!)}</div>
                    <div id="heat-event"></div>
                    <div style="padding: 4px 8px 4px 8px; background:#4F4F4F">
                        <div style="display:flex; align-items:center; margin-bottom: 6px">
                            <div style="width:60px;font-weight:bold; font-size: 14px;color: #F76D52;">${Math.round(closestDataPoint.feelslikemax)} °F</div>
                            <h3 style="font-weight: 500; font-size:10px; color:#F2F2F2">Maximum Air Index</h3>
                        </div> 
                        <div style="display:flex; align-items: center;">
                            <div style="width:60px;font-weight:bold; font-size: 14px;color: #5298AA;">${Math.round(closestDataPoint.feelslikemin)} °F</div>
                             <h3 style="font-weight: 500; font-size:10px;color:#F2F2F2">Minimum Air Index</h3>
                        </div>       
                    </div>
                </div>
            `);

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
            window.removeEventListener('resize', handleResize);
        };
    }, [data]);

    return (
        <div className='relative w-full h-[80%]'>
            <svg ref={svgRef} className='w-full h-full'></svg>
            <div id='tooltip' style={{ position: 'absolute', display: 'none' }}></div>
        </div>
    );
};

export default AirHeatIndexLineChart;
