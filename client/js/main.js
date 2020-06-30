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

        const graph_dataset = data.map(({Year, Seconds}) => [Year, Seconds]);
        // console.log(graph_dataset)

        const w = 1200;
        const h = 600;

        const chartPadding = 40;
        const minYear = d3.min(graph_dataset, d => d[0]);
        const maxYear = d3.max(graph_dataset, d => d[0]);
        const minSecs = d3.min(graph_dataset, d => d[1]);
        const maxSecs = d3.max(graph_dataset, d => d[1]);

        // Scale X
        const scaleX = d3.scaleLinear();
        scaleX.domain([minYear, maxYear]).range([chartPadding, w - chartPadding]);

        // Scale Y
        const scaleY = d3.scaleLinear();
        scaleY.domain([minSecs, maxSecs]).range([chartPadding, h - chartPadding]);

        // Axes
        const xAxis = d3.axisBottom(scaleX);
        const yAxis = d3.axisLeft(scaleY)


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
    });

})();