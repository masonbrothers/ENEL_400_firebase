const PUMP_OFF_USER_ON = 0;
const PUMP_ON_USER_ON = 1;
const PUMP_OFF_USER_OFF = 2;
const PUMP_ON_USER_OFF = 3;
var deviceID = "";
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
    firebase.database().ref(deviceID + 'pumpShouldBeOn').set(isOn);
    console.log(isOn);
    updateUIStateMachine();
}

function updateUIStateMachine()
{
    firebase.database().ref(deviceID + 'pumpIsOn').on('value', function(pumpData) {
        console.log(pumpData.val());
        firebase.database().ref(deviceID + 'pumpShouldBeOn').on('value', function(userData) {
            console.log(userData.val());
            var pumpAndUserData;
            if (pumpData.val() == 0 && userData.val() == 1)
                pumpAndUserData = 0;
            if (pumpData.val() == 1 && userData.val() == 1)
                pumpAndUserData = 1;
            if (pumpData.val() == 0 && userData.val() == 0)
                pumpAndUserData = 2;
            if (pumpData.val() == 1 && userData.val() == 0)
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
    
    firebase.database().ref(deviceID + 'realTimeTime').on('value', function(data) {
        document.getElementById("realTimeTime").innerHTML = data.val();
    });
    firebase.database().ref(deviceID + 'realTimeAmbientTemperature').on('value', function(data) {
        document.getElementById("realTimeAmbientTemperature").innerHTML = data.val();
    });
    firebase.database().ref(deviceID + 'realTimeAmbientHumidity').on('value', function(data) {
        document.getElementById("realTimeAmbientHumidity").innerHTML = data.val();
    });
    firebase.database().ref(deviceID + 'realTimeWaterTemperature').on('value', function(data) {
        document.getElementById("realTimeWaterTemperature").innerHTML = data.val();
    });
    firebase.database().ref(deviceID + 'realTimeAmbientLight').on('value', function(data) {
        document.getElementById("realTimeAmbientLight").innerHTML = data.val();
    });
    firebase.database().ref(deviceID + 'realTimeWaterLevel').on('value', function(data) {
        document.getElementById("realTimeWaterLevel").innerHTML = data.val();
    });
    firebase.database().ref(deviceID + 'realTimeSpillSensor').on('value', function(data) {
        var valueText;
        if (data.val() == 0)
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
    updateUIStateMachine();   
}

function onLogIn()
{
    updateValues();
    setInterval(updateValues(), 10000);
}

$(document).load(function() {
    onLogIn();
})
