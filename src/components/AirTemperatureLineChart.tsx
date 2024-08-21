import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import airHeatIndex from "../data/airHeatIndex2022.json";

interface AirHeatIndexData {
    stations: string;
    datetime: string;
    feelslikemax: number;
    feelslikemin: number;
    Normal_Temp_Max: number;
    Normal_Temp_Min: number;
    NYC_HeatEvent: "" | "NYC_Heat_Event"
    HeatAdvisory: "" | "HeatAdvisory"
    ExcessiveHeat: "" | "Excessive_Heat_Event"
}


const AirTemperatureLineChart = () => {

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

        console.log(data)

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

        const lineMax = d3.line<{ datetime: Date, feelslikemax: number }>()
            .x(d => x(d.datetime))
            .y(d => y(d.feelslikemax));

        const lineNormalMax = d3.line<{ datetime: Date, Normal_Temp_Max: number }>()
            .x(d => x(d.datetime))
            .y(d => y(d.Normal_Temp_Max));

        const lineMin = d3.line<{ datetime: Date, feelslikemin: number }>()
            .x(d => x(d.datetime))
            .y(d => y(d.feelslikemin));

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
            .style('background', '#E2E2E2')
            .style('border', '1px solid #F2F2F2') // Add border color
            .style('border-radius', '12px')
            .style('display', 'none');

        svg.on('mousemove', (event) => {
            const [xPos, yPos] = d3.pointer(event, svgRef.current);
            const xDate = x.invert(xPos);
            const closestDataPoint = data.reduce((prev, curr) =>
                Math.abs(xDate.getTime() - curr.datetime.getTime()) < Math.abs(xDate.getTime() - prev.datetime.getTime())
                    ? curr : prev);

            verticalLine
                .attr('x1', x(closestDataPoint.datetime))
                .attr('x2', x(closestDataPoint.datetime))
                .attr('y1', margin.top)
                .attr('y2', height - margin.bottom)
                .style('display', 'block');

            tooltipDiv
                .style('left', `${xPos}px`) // Add some offset
                .style('top', `${margin.bottom}px`) // Add some offset
                .style('display', 'block')
                .html(`
                <div style="">
                    <div style="padding: 8px; background: #828282; font-weight:bold; font-size:14px; color: #fff; border:1px solid; border:#828282; border-radius: 12px 12px 0 0">${d3.timeFormat('%b %d, %Y')(closestDataPoint.datetime)}</div>
                    <div style="margin: 8px; padding:0">
                        <div style="display:flex; align-items: flex-start; gap: 15px; margin-bottom: 12px">
                            <div style="font-weight:bold; font-size: 14px;color: #F76D52;">${Math.round(closestDataPoint.feelslikemax)} °F</div>
                            <div style="">
                                <h3 style="font-weight: 500; font-size:10px;">Maximum Air Temperature</h3>
                                <div style="display: flex; gap:8px">
                                    <p style="font-weight: bold; font-size: 8px; letter-spacing: -1px;">
                                        ${Math.round(closestDataPoint.feelslikemax) - Math.round(closestDataPoint.Normal_Temp_Max) > 0 ? "+" : "-"}
                                        ${Math.abs(Math.round(closestDataPoint.feelslikemax) - Math.round(closestDataPoint.Normal_Temp_Max))}°
                                    </p>
                                    <p style="font-weight: 500; font-size: 8px">above Historic normal max</p>
                                </div>
                            </div>
                        </div> 
                        <div style="display:flex; gap: 15px; align-items: flex-start;">
                            <div style="font-weight:bold; font-size: 14px;color: #5298AA;">${Math.round(closestDataPoint.feelslikemin)} °F</div>
                            <div style="">
                                <h3 style="font-weight: 500; font-size:10px;">Minimum Air Temperature</h3>
                                <div style="display: flex; gap:8px">
                                    <p style="font-weight: bold; font-size: 8px; letter-spacing: -1px;">
                                        ${Math.round(closestDataPoint.feelslikemin) - Math.round(closestDataPoint.Normal_Temp_Min) > 0 ? "+" : "-"}
                                        ${Math.abs(Math.round(closestDataPoint.feelslikemin) - Math.round(closestDataPoint.Normal_Temp_Min))}°
                                    </p>
                                    <p style="font-weight: 500; font-size: 8px">above Historic normal min</p>
                                </div>
                            </div>
                        </div>       
                    </div>
                </div>
            `);
        })
            .on('mouseout', () => {
                verticalLine.style('display', 'none');
                tooltipDiv.style('display', 'none');
            });
    };

    // <strong>Max Heat Index:</strong> ${closestDataPoint.feelslikemax}<br>
    // <strong>Min Heat Index:</strong> ${closestDataPoint.feelslikemin}

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



export default AirTemperatureLineChart