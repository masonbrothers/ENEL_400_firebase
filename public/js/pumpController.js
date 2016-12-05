const PUMP_OFF_USER_ON = 0;
const PUMP_ON_USER_ON = 1;
const PUMP_OFF_USER_OFF = 2;
const PUMP_ON_USER_OFF = 3;
var deviceID = "club01/";
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

var database = firebase.database();



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
            document.getElementById("realTimeTime").innerHTML = new Date(lastValue*1000);
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
            var valueText;
            if (lastValue == 0)
            {
                valueText = "No spills detected.";
                if ($('#realTimeWarnings').hasClass("btn-warning"))
                    $('#realTimeWarnings').removeClass("btn-warning");
                if ($('#realTimeWarnings').hasClass("btn-danger"))
                    $('#realTimeWarnings').removeClass("btn-danger");
                $('#realTimeWarnings').addClass("btn-success");
            }
            else
            {
                valueText = "There appears to be a spill!";
                if ($('#realTimeWarnings').hasClass("btn-warning"))
                    $('#realTimeWarnings').removeClass("btn-warning");
                if ($('#realTimeWarnings').hasClass("btn-success"))
                    $('#realTimeWarnings').removeClass("btn-success");
                $('#realTimeWarnings').addClass("btn-danger");

            }

            document.getElementById("realTimeSpillSensor").innerHTML = valueText;

            document.getElementById("realTimeWarnings").innerHTML = valueText;
        });
    });

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

    new Chartist.Line('.ct-chart', data, options);


    updateUIStateMachine();   
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
