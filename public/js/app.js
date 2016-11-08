console.log("test");

var ctx = document.getElementById("historyAmbientTemperature");
var scatterChart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [{
            label: 'Scatter Dataset',
            data: [{
                x: -10,
                y: 0
            }, {
                x: 0,
                y: 10
            }, {
                x: 10,
                y: 5
            }]
        }]
    },
    options: {
        scales: {
            xAxes: [{
                type: 'linear',
                position: 'bottom',
                scaleLabel: {
                    display: true,
                    labelString: 'Time (days)'
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Temperature (°C)'
                }
            }]
        }
    }
});

/*
$(".makeHeightHalfWidth").on('resize', function () {
    $('.makeHeightHalfWidth').height($(".makeHeightHalfWidth").width()/2);
}).resize();
*/