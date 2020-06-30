(function() {

    const getData = done => {

        // Get json data.
        const resource = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';
        const init = {
            method: 'GET',
        };

        fetch(resource, init)
            .then(response => response.json())
            .then(data => {

                done(data);

            }).catch(err => console.log(err));

    }

    getData(data => {

        // console.log(data);

        const graph_dataset = data.map(({Year, Seconds, Time}) => {
            
            const timeArr = Time.split(':').map(e => parseInt(e));
            const time = new Date(1970, 0, 1, 0, timeArr[0], timeArr[1]);
            const year = new Date(Year, 0, 1, 0).getFullYear();

            return [year, time]
        });

        const w = 1200;
        const h = 600;

        const chartPadding = 40;
        const minYear = d3.min(graph_dataset, d => d[0]);
        const maxYear = d3.max(graph_dataset, d => d[0]);
        const minSecs = d3.min(graph_dataset, d => d[1]);
        const maxSecs = d3.max(graph_dataset, d => d[1]);

        const yearOffset = 2;

        // Scale X
        const scaleX = d3.scaleLinear();
        scaleX.domain([minYear, maxYear]).range([chartPadding, w - chartPadding]);

        // Scale Y
        const scaleY = d3.scaleLinear();
        scaleY.domain([maxSecs, minSecs]).range([h - chartPadding, chartPadding]);

        // Axes
        const xAxis = d3.axisBottom(scaleX)
        xAxis.tickFormat(d3.format("d"));
        const yAxis = d3.axisLeft(scaleY)
        yAxis.tickFormat(d3.timeFormat('%M:%S'));

        const svg = d3.select('#svg-scatterplot-graph')
            .attr('width', w)
            .attr('height', h)

        // Render X Axis.
        svg.append('g')
            .attr('id', 'x-axis')
            .attr('transform', `translate(0, ${h - chartPadding})`)
            .call(xAxis);

        // Render Y Axis.
        svg.append('g')
            .attr('id', 'y-axis')
            .attr('transform', `translate(${chartPadding}, 0)`)
            .call(yAxis);

        svg.selectAll('circle')
            .data(graph_dataset)
            .enter()
            .append('circle')
            .attr('class', (d, i) => data[i]['Doping'] === "" ? 'dot no-doping' : 'dot doping')
            .attr('data-xvalue', (d, i) => d[0])
            .attr('data-yvalue', d => d[1])
            .attr('cx', (d, i) => scaleX(d[0]))
            .attr('cy', d => scaleY(d[1]))
            .attr('r', 6)

        // Legend
        const legend = svg.append('g')
            .attr('id', 'legend')

        const legendElementX = 880; // X Position
        const legendElementY = 100; // Y Position
        const legendElementH = 24;  // Height
        const legendElementW = 24;  // Width
        const legendElementM = 5;   // Margin
        const textHorizOffset = 30;  // Text Horizontal Offset
        const textVertOffset = 17;   // Text Vertical Offset


        
        // Allegations
        legend.append('rect')
            .attr('width', legendElementW)
            .attr('height', legendElementH)
            .attr('fill', '#16A085')
            .attr('x', legendElementX)
            .attr('y', legendElementY)
            .append('text')
            .text('Test')

        legend.append('text')
            .attr('x', legendElementX + textHorizOffset)
            .attr('y', legendElementY + textVertOffset)
            .text('No doping allegations')
            .style('font-size', '14px')

        // No Allegations
        legend.append('rect')
            .attr('width', legendElementW)
            .attr('height', legendElementH)
            .attr('fill', '#2D3E4E')
            .attr('x', legendElementX)
            .attr('y', legendElementY + legendElementH + legendElementM)

        legend.append('text')
            .attr('x', legendElementX + textHorizOffset)
            .attr('y', legendElementY + legendElementH + legendElementM + textVertOffset)
            .text('Riders with doping allegations')
            .style('font-size', '14px')

            

            
    });

})();