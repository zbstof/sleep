function double00(n) {
    return n > 9 ? "" + n : "0" + n;
};

function createMaybeSelected(measureNeeded, measureActual) {
    var option;
    if (measureActual == measureNeeded) {
        option = $("<option selected/>").text(double00(measureActual));
    } else {
        option = $("<option />").text(double00(measureActual));
    }
    return option;
}


var currentdate = new Date();
var currenthours = currentdate.getHours();
var currentminutes = currentdate.getMinutes();
$("#textbox").text(currenthours + ":").append(currentminutes);

function chetkoHour(total) {
    return Math.floor(total / 60);
};

function chetkoMinutes(total) {
    return total % 60;
};
var phaseTime = 2 * 60 + 20;

$(function() {
    for (var i = 0; i < 24; i++) {
        $("select#hours").append(createMaybeSelected(currenthours, i));
    };

    for (var i = 0; i < 60; i++) {
        $("select#minutes").append(createMaybeSelected(currentminutes, i));
    };


    $("select").change(function() {
        var pickedHours = $("select#hours option:selected").text();
        var pickedMinutes = $("select#minutes option:selected").text();
        var minutesFromBeginning = parseInt(pickedHours) * 60 + parseInt(pickedMinutes);

        // just six time slots
        var wakeTimes = [];
        for (var i = 1; i < 6; i++) {
            var wakeTime = minutesFromBeginning + phaseTime * i;
            // if (wakeTime >= 24 * 60) {
            //     wakeTime = wakeTime - 24 * 60;
            // };
            wakeTimes.push(wakeTime);
        }

        $("div#list").html("");
        $(wakeTimes).each(function(index, number) {
            var hourLabel = number;
            if (number >= 24 * 60) {
                hourLabel = number - 24 * 60;
            };
            var wakeDivLabel = double00(chetkoHour(hourLabel)) + ":" + double00(chetkoMinutes(number));
            var wakeDiv = "<input type='radio' name='alarmTime' value='" +
                number + "'>" + wakeDivLabel + "<br>";
            $("div#list").append(wakeDiv);
        });


        $("input[name=alarmTime]:radio").change(function() {
            var currentTime = new Date();
            var timeout = 1000 * (
                60 * parseInt(this.value) -
                (currentTime.getHours() * 60 * 60 + currentTime.getMinutes() * 60 + currentTime.getSeconds())
            );
            console.log(timeout / 1000 );
            setTimeout(function() {
                audioElement.pause();
                audioElement.currentTime = 0;
                audioElement.play();
            }, timeout);
        });

    });

    $("select").change();
    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', 'alarm.mp3');
    $("body").append(audioElement);
});
