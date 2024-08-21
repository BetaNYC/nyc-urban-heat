import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import airHeatIndex from "../data/airHeatIndex2022.json";

interface AirHeatIndexData {
    stations: string;
    datetime: string;
    feelslikemax: number;
    feelslikemin: number;
    NYC_HeatEvent: "" | "NYC_Heat_Event"
    HeatAdvisory: "" | "HeatAdvisory"
    ExcessiveHeat: "" | "Excessive_Heat_Event"
}

const AirHeatIndexLineChart = () => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    const renderChart = () => {


        const parseDate = d3.timeParse('%Y-%m-%d');

        const data = (airHeatIndex as AirHeatIndexData[])
            .filter(d => d.stations === "['AV066']")
            .map(d => ({
                ...d,
                datetime: parseDate(d.datetime)!,
            }))
            .filter(d => d.datetime !== null);

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
                parseDate('2022-05-01') as Date,
                parseDate('2022-10-01') as Date
            ] as [Date, Date])
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain([30, 120])
            .range([height - margin.bottom, margin.top]);

        const tickDates = [
            parseDate('2022-05-01'),
            parseDate('2022-06-01'),
            parseDate('2022-07-01'),
            parseDate('2022-08-01'),
            parseDate('2022-09-01'),
            parseDate('2022-10-01')
        ];

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
            .attr("stroke-width", 0.5);

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
            .attr("stroke-width", 0.5);

        const yAxis = svg.append("g")
            .attr("transform", `translate(${margin.left}, 0)`)
            .attr("class", "grid")
            .call(d3.axisLeft(y)
                .tickSize(-width + margin.left + margin.right)
            )
            .attr("stroke-width", 0.5);

        yAxis.selectAll("path, line")
            .attr("stroke", "#999")
            .attr("stroke-width", 0.5);

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

        // Calculate the width of one date tick
        // Calculate the width of one date tick
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
        const heatDaysRectsDrawer = (dates: Date[], color: string, partIndex: number) => {
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
                            svg.select('#heat-event').append('text').text('heat')
                            .attr('x', 50) // Example x position
                            .attr('y', 50)
                            .style('font-size', '12px')
                            .style('fill', '#000'); // Example style
                        })
                        .on('mouseout', () => {

                            tooltipDiv.style('background', '#4F4F4F')

                        })
                }
            });
        };


        // nycHeatEventDates = [parseDate('2022-08-09')]
        // heatAdvisoryDates = [parseDate('2022-08-09')]
        // excessiveHeatDates = [parseDate('2022-08-09')]

        heatDaysRectsDrawer(nycHeatEventDates, "#AD844A", 0);
        heatDaysRectsDrawer(heatAdvisoryDates, "#A46338", 1);
        heatDaysRectsDrawer(excessiveHeatDates, "#823E35", 2);



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

        const tooltipDiv = d3.select('#tooltip')
            .style('position', 'absolute')
            .style('background', '#4F4F4F')
            .style('border', '1px solid #4F4F4F') // Add border color
            .style('border-radius', '12px')
            .style('display', 'none');

        svg.on('mousemove', (event) => {
            const [xPos, yPos] = d3.pointer(event, svgRef.current);
            const xDate = x.invert(xPos);
            const closestDataPoint = data.reduce((prev, curr) =>
                Math.abs(xDate.getTime() - curr.datetime.getTime()) < Math.abs(xDate.getTime() - prev.datetime.getTime())
                    ? curr : prev);

            tooltipDiv
                .style('left', `${xPos}px`) // Add some offset
                .style('top', `${margin.bottom}px`) // Add some offset
                .style('display', 'block')
                .html(`
                <div style="">
                    <div style="padding:4px 8px 4px 8px;  font-weight:medium; font-size:10px; color: #f2f2f2; border-bottom: 1px solid #F2F2F2; border-radius: 12px 12px 0 0">${d3.timeFormat('%b %d, %Y')(closestDataPoint.datetime)}</div>
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
        })
            .on('mouseout', () => {
                tooltipDiv.style('display', 'none');
            });
    };

    useEffect(() => {
        renderChart();

        window.addEventListener('resize', renderChart);

        return () => {
            window.removeEventListener('resize', renderChart);
        };
    }, []);

    return (
        <div className='relative w-full h-[80%]'>
            <svg ref={svgRef} className='w-full h-full'></svg>
            <div id='tooltip' style={{ position: 'absolute', display: 'none' }}></div>
        </div>
    );
};

export default AirHeatIndexLineChart;

// jessicayang6768@gmail.com
//8/19 上午十點