//global variables
var nmin = 0;
var nmax = 0;
var n = 0;

var x = [];
var y = [];
var ySquared = [];

var v = [];
var vSquared = [];


//calculate O(n)
function calculateY(n) {
    return n;
}


//calculate O(n^2)
function calculateYSquared(n) {
    return n * n;
}


//display calculator message
function showMessage(text) {

    var message =
        document.getElementById('calculatorMessage');

    if (message) {
        message.textContent = text;
    }
}


//validate calculator inputs
function validateInputs() {

    var minInput =
        document.getElementById('nmin');

    var maxInput =
        document.getElementById('nmax');

    if (!minInput || !maxInput) {
        return false;
    }

    nmin = Number(minInput.value);
    nmax = Number(maxInput.value);

    showMessage('');

    if (!Number.isInteger(nmin) ||
        !Number.isInteger(nmax)) {

        showMessage(
            'Please enter whole numbers for both input values.'
        );

        return false;
    }

    if (nmin < 1 || nmax < 1) {

        showMessage(
            'Input values must be 1 or greater.'
        );

        return false;
    }

    if (nmin > nmax) {

        showMessage(
            'The minimum input cannot be greater than the maximum input.'
        );

        return false;
    }

    if (nmax > 200) {

        showMessage(
            'Please use a maximum input of 200 or less.'
        );

        return false;
    }

    return true;
}


//calculate values
function calculate() {

    if (!validateInputs()) {
        return false;
    }

    //clear previous values
    x = [];
    y = [];
    ySquared = [];

    v = [];
    vSquared = [];

    var i = 0;

    for (var nt = nmin; nt <= nmax; nt++) {

        x[i] = nt;

        y[i] =
            calculateY(nt);

        ySquared[i] =
            calculateYSquared(nt);

        //store O(n) graph values
        v[i] = [
            x[i],
            y[i]
        ];

        //store O(n^2) graph values
        vSquared[i] = [
            x[i],
            ySquared[i]
        ];

        i++;
    }

    n = i - 1;

    return true;
}


//display calculated values
function displayValues() {

    var output =
        document.getElementById('output');

    if (!output) {
        return;
    }

    var s = '';

    s += '<div class="output-equations">';

    s += '<div>O(n) = n</div>';

    s +=
        '<div>O(n<sup>2</sup>) = n<sup>2</sup></div>';

    s += '</div>';

    s += '<div class="output-values">';

    for (var i = 0; i <= n; i++) {

        s += '<div class="output-row">';

        s +=
            '<span>n = '
            + x[i]
            + '</span>';

        s +=
            '<span>O(n) = '
            + y[i]
            + '</span>';

        s +=
            '<span>O(n<sup>2</sup>) = '
            + ySquared[i]
            + '</span>';

        s += '</div>';
    }

    s += '</div>';

    output.innerHTML = s;
}


//display growth summary
function displaySummary() {

    var summary =
        document.getElementById('growthSummary');

    if (!summary) {
        return;
    }

    var linearValue =
        calculateY(nmax);

    var quadraticValue =
        calculateYSquared(nmax);

    var growthDifference =
        quadraticValue / linearValue;

    var s = '';

    s += '<p>';

    s +=
        'At n = <strong>'
        + nmax
        + '</strong>, O(n) = <strong>'
        + linearValue
        + '</strong> and O(n<sup>2</sup>) = <strong>'
        + quadraticValue
        + '</strong>. O(n<sup>2</sup>) is <strong>'
        + growthDifference
        + ' times the value of O(n)</strong>.';

    s += '</p>';

    s +=
        '<p><strong>Growth:</strong> '
        + 'O(n) grows steadily, while O(n<sup>2</sup>) '
        + 'grows much faster as input increases.</p>';

    s +=
        '<p><strong>Scalability:</strong> '
        + 'O(n) generally handles larger inputs more efficiently '
        + 'than O(n<sup>2</sup>).</p>';

    s +=
        '<p><strong>Why Big O matters:</strong> '
        + 'Big O helps developers compare how algorithms '
        + 'scale as input sizes increase.</p>';

    summary.innerHTML = s;
}

//plot calculated values
function plotValues() {

    if (typeof Highcharts === 'undefined') {

        showMessage(
            'Highcharts failed to load.'
        );

        return;
    }

    Highcharts.chart('container', {

        chart: {
            type: 'line',
            backgroundColor: '#121416'
        },

        title: {
            text:
                'Big O Time Complexity Comparison',

            style: {
                color: '#f5f5f4',
                fontWeight: '600'
            }
        },

        accessibility: {
            description:
                'This chart compares O(n) linear growth with O(n squared) quadratic growth as input size increases.'
        },

        xAxis: {

            title: {
                text: 'Input Size (n)',

                style: {
                    color: '#cbc7bd'
                }
            },

            labels: {
                style: {
                    color: '#cbc7bd'
                }
            },

            lineColor: '#57534e',

            tickColor: '#57534e',

            gridLineColor: '#3d3b37'
        },

        yAxis: {

            title: {
                text: 'Growth Value',

                style: {
                    color: '#cbc7bd'
                }
            },

            labels: {
                style: {
                    color: '#cbc7bd'
                }
            },

            gridLineColor: '#3d3b37'
        },

        legend: {

            itemStyle: {
                color: '#f5f5f4'
            },

            itemHoverStyle: {
                color: '#fcd34d'
            },

            itemHiddenStyle: {
                color: '#77736c'
            }
        },

        tooltip: {

            shared: true,

            backgroundColor: '#1a1c1f',

            borderColor: '#57534e',

            style: {
                color: '#f5f5f4'
            }
        },

        series: [
            {
                name: 'O(n)',
                color: '#f59e0b',
                data: v
            },

            {
                name: 'O(n\u00B2)',
                color: '#fcd34d',
                data: vSquared
            }
        ]

    });
}


//set up calculator buttons
function initializeCalculator() {

    var calculateButton =
        document.getElementById('calculate');

    var plotButton =
        document.getElementById('plot');

    if (calculateButton) {

        calculateButton.addEventListener(
            'click',
            function () {

                if (calculate()) {

                    displayValues();

                    displaySummary();
                }
            }
        );
    }

    if (plotButton) {

        plotButton.addEventListener(
            'click',
            function () {

                if (calculate()) {

                    displayValues();

                    displaySummary();

                    plotValues();
                }
            }
        );
    }
}


//initialize page
if (document.readyState === 'loading') {

    document.addEventListener(
        'DOMContentLoaded',
        initializeCalculator
    );

} else {

    initializeCalculator();
}