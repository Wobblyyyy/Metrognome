const buttonTapTempo = document.getElementById('tap_tempo');
const inputTempo = document.getElementById('tempo');
const buttonStartStop = document.getElementById('start_stop');

const Metrognome = {
    isActive: false,

    click: function () {
        console.log('click!');
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
        this.setMetronomeState(true, 'STOP');
        this.scheduleNextClick(this.click);
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
