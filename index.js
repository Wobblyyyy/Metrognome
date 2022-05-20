const buttonTapTempo = document.getElementById('tap_tempo');
const inputTempo = document.getElementById('tempo');
const buttonStartStop = document.getElementById('start_stop');
const pCurrentBeat = document.getElementById('current_beat');
const divMiddleBar = document.getElementById('middle_bar');

const BUTTON_TYPES = [
    'primary',
    'secondary',
    'ternary'
];

// beat object types:
// - primary
// - secondary
// - ternary
function getBeatObject(beat, beatType) {
    return `<div onclick="onClickBeatButton(${beat})" ` +
        `id="beat${beat}" class="beat ${beatType}">${beat}</div>`;
}

function getNextType(currentType) {
    switch (currentType) {
        case 'primary':
            return 'secondary';
        case 'secondary':
            return 'ternary';
        case 'ternary':
            return 'primary';
    }
}

// this is a really bad solution oops
function getCurrentType(classList) {
    for (const type of BUTTON_TYPES) {
        if (classList.contains(type)) {
            return type;
        }
    }
}

function onClickBeatButton(buttonBeat) {
    const button = document.getElementById(`beat${buttonBeat}`);
    const currentType = getCurrentType(button.classList);
    const nextType = getNextType(currentType);

    button.classList.remove(currentType);
    button.classList.add(nextType);
}

function getBeatArray(beats) {
    let beatArray = [];

    for (let beat = 1; beat <= beats; beat++) {
        let beatType;

        if (beat == 1) {
            beatType = 'primary';
        } else {
            beatType = 'secondary';
        }

        const beatObject = getBeatObject(beat, beatType);
        beatArray.push(beatObject);
    }

    return beatArray;
}

function displayBeatArray(beats) {
    const beatArray = getBeatArray(beats);
    divMiddleBar.innerHTML = beatArray;
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

    getCurrentBeatButton: function () {
        return document.getElementById(`beat${Metrognome.currentBeat}`);
    },

    getPreviousBeatButton: function () {
        if (Metrognome.currentBeat == 1) {
            return document.getElementById(`beat${Metrognome.timeSigBeats}`);
        } else {
            return document.getElementById(`beat${Metrognome.currentBeat - 1}`);
        }
    },

    click: function () {
        if (!Metrognome.isActive) {
            return;
        }

        Metrognome.currentBeat++;
        if (Metrognome.currentBeat > Metrognome.timeSigBeats) {
            Metrognome.currentBeat = 1;
        }

        pCurrentBeat.innerHTML = Metrognome.currentBeat;

        const currentBeatButton = Metrognome.getCurrentBeatButton();
        const previousBeatButton = Metrognome.getPreviousBeatButton();

        currentBeatButton.classList.add('active');
        previousBeatButton.classList.remove('active');
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
        Metrognome.setMetronomeState(false, 'START');
        pCurrentBeat.innerHTML = 0;
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
    displayBeatArray(Metrognome.timeSigBeats);
    Metrognome.toggle();
});
