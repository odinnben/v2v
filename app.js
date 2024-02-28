// Define the function to play a note
function playNote(note) {
    const synth = new Tone.Synth().toDestination();
    const now = Tone.now();
    synth.triggerAttackRelease(note, "8n", now);
}

// Function to handle keydown events
function keydown(event) {
    const keyNotes = {
        // Mapping of key codes to notes A - ;
        65: 'C4',  // 'A'
        87: 'C#4', // 'W'
        83: 'D4',  // 'S'
        69: 'D#4', // 'E'
        68: 'E4',  // 'D'
        70: 'F4',  // 'F'
        84: 'F#4', // 'T'
        71: 'G4',  // 'G'
        89: 'G#4', // 'Y'
        72: 'A4',  // 'H'
        85: 'A#4', // 'U'
        74: 'B4',  // 'J'
        75: 'C5',  // 'K'
        79: 'C#5', // 'O'
        76: 'D5',  // 'L'
        80: 'D#5', // 'P'
        186: 'E5'  // ';'
    };

    // Check if the pressed key has a corresponding note
    if (keyNotes[event.keyCode]) {
        const note = keyNotes[event.keyCode];
        // Play the corresponding note
        playNote(note);
    }
}

// Function to get all tunes from the backend
async function getTunes() {
    console.log('Fetching tunes...');
    try {
        const response = await axios.get('https://github.com/odinnben/v2v/blob/main/assignment2_backend/index.js');
        const tunes = response.data;

        // Debugging: print the fetched tunes
        console.log(tunes);

        // Clear the existing options in the dropdown
        const tunesDropdown = document.getElementById('tunesDrop');
        tunesDropdown.innerHTML = '';

        // Populate the dropdown with the fetched tunes
        tunes.forEach(tune => {
            const option = document.createElement('option');
            option.value = tune.id;
            option.textContent = tune.name;
            tunesDropdown.appendChild(option);
        });
    }
    catch (error) {
        //When unsuccessful, print the error.
        console.log(error);
    }
    // This code is always executed, independent of whether the request succeeds or fails.
}

async function playTune(tuneId) {
    // Stop the Tone.Transport before playing a new tune
    // Stop any currently playing notes
    Tone.Transport.bpm.value = 0;
    Tone.Transport.stop();
    Tone.Transport.clear();

    try {
        const response = await axios.get('https://github.com/odinnben/v2v/blob/main/assignment2_backend/index.js');
        const tunes = response.data;

        // Find the tune with the given id
        const selectedTune = tunes.find((tune) => tune.id === tuneId);

        if (selectedTune) {
            // Create the synth and connect it to the master output
            const synth = new Tone.Synth().toDestination();

            // Schedule the notes based on the tune
            selectedTune.tune.forEach((noteObj, index) => {
                const now = Tone.now() + noteObj.timing;
                synth.triggerAttackRelease(noteObj.note, noteObj.duration, now);
            });

            // Start the transport if it isn't running
            if (!Tone.Transport.state === 'started') {
                Tone.Transport.start();
            }
        } else {
            console.error(`Tune with id ${tuneId} not found.`);
        }
    } catch (error) {
        console.error('Error fetching or playing tune:', error);
    }
}

function getSelectedTuneId() {
    const selectElement = document.getElementById('tunesDrop');
    const selectedIndex = selectElement.selectedIndex;
    const tuneId = selectElement.options[selectedIndex].value;
    playTune(tuneId);
}
// Add event listener for keydown
document.addEventListener('keydown', keydown);

// Call getTunes when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', getTunes);
window.onload = getTunes;

document.getElementById('tunesDropdown').addEventListener('change', playTune);
