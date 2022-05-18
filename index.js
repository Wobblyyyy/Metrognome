const buttonTapTempo = document.getElementById('tap_tempo');
const inputTempo = document.getElementById('tempo');
const buttonStartStop = document.getElementById('start_stop');
const pCurrentBeat = document.getElementById('current_beat');

function getBeatObject(beat) {
    return `<div class="beat">${beat}</div>`;
}

function getBeatArray(beats) {
    let beatArray = [];
    for (let beat = 1; beat <= beats; beat++) {
        beatArray.push(getBeatObject(beat));
    }
    return beatArray;
}

const Metrognome = {
    // is the metronome currently active?
    isActive: false,
    // the amount of beats per measure
    timeSigBeats: 4,
    // what type of note gets one beat
    timeSigOneBeat: 4,
    // what beat the metronome is currently on
    currentBeat: 0,

    click: function () {
        if (!Metrognome.isActive) {
            return;
        }

        Metrognome.currentBeat++;
        if (Metrognome.currentBeat > Metrognome.timeSigBeats) {
            Metrognome.currentBeat = 1;
        }

        pCurrentBeat.innerHTML = Metrognome.currentBeat;
    },
    setMetronomeState: function (isActive, state) {
        buttonStartStop.innerHTML = state;
        this.isActive = isActive;
    },
    scheduleNextClick: function (clickFunction) {
        const beatsPerMinute = inputTempo.value;
        const minutesPerBeat = 1 / beatsPerMinute;
        const secondsPerBeat = minutesPerBeat * 60;
        const millisecondsPerBeat = secondsPerBeat * 1_000;
        /*
        console.log({
            bpm: beatsPerMinute,
            mpb: minutesPerBeat,
            spb: secondsPerBeat,
            mspb: millisecondsPerBeat
        });
        */

        if (this.isActive) {
            setTimeout(() => {
                this.scheduleNextClick(clickFunction);
                clickFunction();
            }, millisecondsPerBeat);
        }
    },
    start: function () {
        Metrognome.setMetronomeState(true, 'STOP');
        Metrognome.scheduleNextClick(Metrognome.click);
        Metrognome.currentBeat = 0;
        Metrognome.click();
    },
    stop: function () {
        this.setMetronomeState(false, 'START');
    },
    toggle: function () {
        if (this.isActive) {
            this.stop();
        } else {
            this.start();
        }
    }
};

buttonStartStop.addEventListener('click', () => {
    console.log('button has been clicked!');
    Metrognome.toggle();
});
