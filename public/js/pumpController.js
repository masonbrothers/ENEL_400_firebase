const HOUR_OFFSET = 7;


const PUMP_OFF_USER_ON = 0;
const PUMP_ON_USER_ON = 1;
const PUMP_OFF_USER_OFF = 2;
const PUMP_ON_USER_OFF = 3;
var deviceID = "club01/";
/*
function getPumpState()
{
    // STUB
    //Returns 1 for On
    //Returns 0 for Off
    return 0;
}

function getUserState()
{
    // STUB
    //Returns 1 for On
    //Returns 0 for Off
    return 0;
}
*/
function setUserState(isOn)
{
    //Returns 1 for Updated
    //Returns 0 for Failure
    firebase.database().ref(deviceID + 'u').set(isOn);
    console.log(isOn);
    updateUIStateMachine();
}

function updateUIStateMachine()
{
    firebase.database().ref(deviceID + 'p').on('value', function(pumpData) { // p is pump is on
        var pumpIsOnList = toArray(pumpData.val());

        getLastValueBeforeCounter(pumpIsOnList, function (pumpIsOn) {
            console.log("Pump Is On: " + pumpIsOn);
            firebase.database().ref(deviceID + 'u').on('value', function(userData) { // u is pump should be on
                console.log(userData.val());
                var pumpAndUserData;
                if (pumpIsOn == 0 && userData.val() == 1)
                    pumpAndUserData = 0;
                if (pumpIsOn == 1 && userData.val() == 1)
                    pumpAndUserData = 1;
                if (pumpIsOn == 0 && userData.val() == 0)
                    pumpAndUserData = 2;
                if (pumpIsOn == 1 && userData.val() == 0)
                    pumpAndUserData = 3;
                console.log("Pump and User Data: " + pumpAndUserData);
                var temp = setUIStateMachine(pumpAndUserData);
                document.getElementById("pumpButton").innerHTML = temp.buttonText;
                document.getElementById("pumpButton").onclick = function() {
                    var shouldToggle = window.confirm(temp.warningAfterClickText);
                    if (shouldToggle && userData.val() == 0)
                        setUserState(1);
                    if (shouldToggle && userData.val() == 1)
                        setUserState(0);
                }
            });
        });
    }, function(error){

    });
}

function setUIStateMachine(pumpAndUserState)
{
    var buttonText;
    var warningAfterClickText;
    if (pumpAndUserState == PUMP_OFF_USER_ON)
    {
        if ($('#pumpButton').hasClass("btn-success"))
            $('#pumpButton').removeClass("btn-success");
        if ($('#pumpButton').hasClass("btn-danger"))
            $('#pumpButton').removeClass("btn-danger");
        $('#pumpButton').addClass("btn-warning");
        // The pump is off and turning on
        buttonText = "Pump turning on. Click to keep off.";
        warningAfterClickText = "The pump was last reported to be off. Are you sure you want to keep the pump off?";
    }
    if (pumpAndUserState == PUMP_ON_USER_OFF)
    {
        if ($('#pumpButton').hasClass("btn-success"))
            $('#pumpButton').removeClass("btn-success");
        if ($('#pumpButton').hasClass("btn-danger"))
            $('#pumpButton').removeClass("btn-danger");
        $('#pumpButton').addClass("btn-warning");
        // The pump is on and turning off
        buttonText = "Pump turning off. Click to keep on.";
        warningAfterClickText = "The pump was last reported to be on. Are you sure you want to keep the pump on?";
    }
    if (pumpAndUserState == PUMP_OFF_USER_OFF)
    {
        if ($('#pumpButton').hasClass("btn-success"))
            $('#pumpButton').removeClass("btn-success");
        if ($('#pumpButton').hasClass("btn-warning"))
            $('#pumpButton').removeClass("btn-warning");
        $('#pumpButton').addClass("btn-danger");
        // The pump is off
        buttonText = "Pump off. Click to turn on.";
        warningAfterClickText = "The pump was last reported to be off. Are you sure you want to turn the pump on?";
    }
    if (pumpAndUserState == PUMP_ON_USER_ON)
    {
        if ($('#pumpButton').hasClass("btn-warning"))
            $('#pumpButton').removeClass("btn-warning");
        if ($('#pumpButton').hasClass("btn-danger"))
            $('#pumpButton').removeClass("btn-danger");
        $('#pumpButton').addClass("btn-success");
        // The pump is on
        buttonText = "Pump on. Click to turn off.";
        warningAfterClickText = "The pump was last reported to be on. Are you sure you want to turn the pump off?";
    }


    return {buttonText: buttonText, warningAfterClickText: warningAfterClickText};

}


function updateValues()
{

    /* 
    All of the following are arrays:
        p - pumpIsOn
        h - humidity
        a - ambient temperature
        l - ambient light
        t - time
        v - water level
        w - water temperature
        s - spill sensor
    These are ints:
        c - counter
        u - pump should be on
    */

    firebase.database().ref(deviceID + 't').on('value', function(data) {
        getLastValueBeforeCounter(toArray(data.val()), function (lastValue) {
            document.getElementById("realTimeTime").innerHTML = getDateTimeFromUnix(lastValue);
        });
    });
    firebase.database().ref(deviceID + 'a').on('value', function(data) {
        getLastValueBeforeCounter(toArray(data.val()), function (lastValue) {
            document.getElementById("realTimeAmbientTemperature").innerHTML = lastValue;
        });
    });
    firebase.database().ref(deviceID + 'h').on('value', function(data) {
        getLastValueBeforeCounter(toArray(data.val()), function (lastValue) {
            document.getElementById("realTimeAmbientHumidity").innerHTML = lastValue;
        });
    });
    firebase.database().ref(deviceID + 'w').on('value', function(data) {
        getLastValueBeforeCounter(toArray(data.val()), function (lastValue) {
            document.getElementById("realTimeWaterTemperature").innerHTML = lastValue;
        });
    });
    firebase.database().ref(deviceID + 'l').on('value', function(data) {
        getLastValueBeforeCounter(toArray(data.val()), function (lastValue) {
            document.getElementById("realTimeAmbientLight").innerHTML = lastValue;
        });
    });
    firebase.database().ref(deviceID + 'v').on('value', function(data) {
        getLastValueBeforeCounter(toArray(data.val()), function (lastValue) {
            document.getElementById("realTimeWaterLevel").innerHTML = lastValue;
        });
    });
    firebase.database().ref(deviceID + 's').on('value', function(data) {
        getLastValueBeforeCounter(toArray(data.val()), function (lastValue) {
            
            /*
            var valueText;
            if (lastValue == 0)
            {
                valueText = "No spills detected.";
                if ($('#realTimeWarnings').hasClass("alert-warning"))
                    $('#realTimeWarnings').removeClass("alert-warning");
                if ($('#realTimeWarnings').hasClass("alert-danger"))
                    $('#realTimeWarnings').removeClass("alert-danger");
                $('#realTimeWarnings').addClass("alert-success");
            }
            else
            {
                valueText = "There appears to be a spill!";
                if ($('#realTimeWarnings').hasClass("alert-warning"))
                    $('#realTimeWarnings').removeClass("alert-warning");
                if ($('#realTimeWarnings').hasClass("alert-success"))
                    $('#realTimeWarnings').removeClass("alert-success");
                $('#realTimeWarnings').addClass("alert-danger");

            }

            document.getElementById("realTimeSpillSensor").innerHTML = valueText;

            document.getElementById("realTimeWarnings").innerHTML = valueText;
            */
            document.getElementById("realTimeWarnings").innerHTML = "Feature Arriving Q1 2017";
            document.getElementById("realTimeSpillSensor").innerHTML = "Feature Arriving Q1 2017";
        });
    });

    /*
    var data = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        series: [
            [5, 2, 4, 2, 0]
        ]
    };

    var options = {
        width: 300,
        height: 200
    };

    var responsiveOptions = [
        ['screen and (min-width: 641px) and (max-width: 1024px)', {
            showPoint: false,
            axisX: {
                labelInterpolationFnc: function(value) {
                    // Will return Mon, Tue, Wed etc. on medium screens
                    return value.slice(0, 3);
                }
            }
        }],
        ['screen and (max-width: 640px)', {
            showLine: false,
            axisX: {
                labelInterpolationFnc: function(value) {
                    // Will return M, T, W etc. on small screens
                    return value[0];
                }
            }
        }]
    ];

    new Chartist.Line('.ct-chart', data, null, responsiveOptions);
    */

    updateUIStateMachine();
    updateHistory();
}


function updateHistory()
{
    arraysToDataObject(currentHistoryGraph, function(data) {
        updateGraph(data, labelLookup(currentHistoryGraph))
    });
}

var currentHistoryGraph = 'a';

document.getElementById("historySelect").onchange = function (data) {
    currentHistoryGraph = document.getElementById("historySelect").value;
    updateHistory();
}

function labelLookup(inputShort)
{
    if (inputShort == 'p') return 'Pump Is On (on/off)';
    if (inputShort == 'h') return 'Humidity (%)';
    if (inputShort == 'a') return 'Ambient Temperature (°C)';
    if (inputShort == 'l') return 'Ambient Light (lux)';
    if (inputShort == 't') return 'Time';
    if (inputShort == 'v') return 'Water Level (cm)';
    if (inputShort == 'w') return 'Water Temperature (°C)';
    if (inputShort == 's') return 'Spill Sensor (on/off)';
    if (inputShort == 'c') return 'Counter';
    if (inputShort == 'u') return 'Pump Should Be On (on/off)';
    return "Unknown";
}

function arraysToDataObject(typeToCheck,callback)
{
    firebase.database().ref(deviceID + 't').on('value', function(timeData) {
        var timeArray = toArray(timeData.val());
        firebase.database().ref(deviceID + typeToCheck).on('value', function(typeToCheckData) {
            if (typeToCheck == currentHistoryGraph) //To fix a callback bug
            {
                var typeArray = toArray(typeToCheckData.val());
                var dataToReturn = [];
                for (var i = 0; i < typeArray.length; i++)
                {
                    if (timeArray[i] != null && typeArray[i] != null)
                    {
                        dataToReturn.push(
                            {
                                x:moment(getDateTimeFromUnix(timeArray[i])),
                                y:typeArray[i]
                            }
                        );
                    }
                }
                callback(dataToReturn);
            }
        });
    });
}

var theChart;

function updateGraph(dataInput, yAxisLabel)
{
    if (theChart !== undefined)
        theChart.destroy();
    var ctx = document.getElementById("myChart");
    console.log("HERE" + yAxisLabel)
    theChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: (yAxisLabel + " as a function of Time"),
                data: dataInput
            }]
        },
        options: {
            animation : false,
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        format: "HH:mm",
                        unit: 'hour',
                        unitStepSize: 2,
                        displayFormats: {
                            minute: 'HH:mm', 
                            hour: 'HH:mm'/*, 
                            min: ,
                            max: */
                        },
                    },
                    position: 'bottom',
                    scaleLabel: {
                        display: true,
                        labelString: 'Time'
                    }
                }],

                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: yAxisLabel
                    }
                }]
            }
        }
    });
}
/*
$(document).ready(function{
    $('.chartArea').each(function(i, obj) {
        obj.onresize = function() {
            obj.height;
        }
    });
});
*/

function getDateTimeFromUnix(input)
{
    var dateTime = new Date(input*1000);
    dateTime.setHours(dateTime.getHours() + HOUR_OFFSET);
    return dateTime;
}

function getLastValueBeforeCounter(inputArray, callback)
{
    firebase.database().ref(deviceID + 'c').on('value', function(data) {
        var counter = data.val();
        console.log(counter);

        if (counter >= 1)
            callback(inputArray.slice(0, counter-1).slice(-1)[0]);
        else if (counter == 0)
            callback(inputArray[0]);
        else
            callback(inputArray.slice(-1)[0]);
    });
}

function toArray(theObject)
{
    return $.map(theObject, function(value, index) {
        return [value];
    });
}


function onLogIn()
{
    updateValues();
    setInterval(updateValues(), 10000);
}

$(document).load(function() {
    onLogIn();
})
