import  { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import airHeatIndex from "../data/airHeatIndex2022.json";

interface AirHeatIndexData {
    stations: string;
    datetime: string;
    feelslikemax: number;
    feelslikemin: number;
}

const AirHeatIndexLineChart = () => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    const renderChart = () => {
        const parseDate = d3.timeParse('%Y-%m-%d');
        const data: { datetime: Date | null, feelslikemax: number, feelslikemin: number }[] = (airHeatIndex as AirHeatIndexData[])
            .filter(d => d.stations === "['KNYC']")
            .map(d => ({
                ...d,
                datetime: parseDate(d.datetime)
            }))
            .filter(d => d.datetime !== null) as { datetime: Date, feelslikemax: number, feelslikemin: number }[];

        const svgElement = svgRef.current;
        if (!svgElement) return;

        const margin = { top: 20, right: 20, bottom: 20, left: 60 };
        const width = svgElement.clientWidth
        const height = svgElement.clientHeight

        const svg = d3.select(svgElement)
            .attr('width', width)
            .attr('height', height);

        const x = d3.scaleTime()
            .domain(d3.extent(data, d => d.datetime) as [Date, Date])
            .range([margin.left, width]);

        const y = d3.scaleLinear()
            .domain([30, 120])
            .range([height - margin.bottom, margin.top]);

        const xAxis = svg.append("g")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(d3.axisBottom(x));

        xAxis.selectAll("path, line")
            .attr("stroke", "#999")
            .attr("stroke-width", 1); 

        xAxis.selectAll("text")
            .attr("fill", "#999");

        xAxis.append("g")
            .attr("class", "grid")
            .call(d3.axisBottom(x)
                .tickSize(-height) 
            )
            .selectAll(".tick line") 
            .attr("stroke", "#999") 
            .attr("stroke-width", 0.5);

        const yAxis = svg.append("g")
            .attr("transform", `translate(${margin.left}, 0)`)
            .attr("class", "grid")
            .call(d3.axisLeft(y)
                .tickSize(-width + margin.left)
            )
            .attr("stroke-width", 0.5);


        yAxis.selectAll(".tick")
            .attr("stroke", "#999")
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
    };

    useEffect(() => {
        renderChart();

        window.addEventListener('resize', renderChart);

        return () => {
            window.removeEventListener('resize', renderChart);
        };
    }, []);

    return (
        <svg ref={svgRef} className='w-[90%] h-[90%] border-2'></svg>
    );
};

export default AirHeatIndexLineChart;

// jessicayang6768@gmail.com
//8/19 上午十點