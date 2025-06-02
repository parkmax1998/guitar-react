import { useState } from 'react'
import './guitar.css'

export default function App() {
  const strings = [`lowStringE`, `stringA`, `stringD`, `stringG`, `stringB`, `highStringE`];
  const frets = Array.from({length:22}, (_,i) => i);
  const waveType = `sawtooth`; // Determine type of wave used for the oscillators
  const [selectedFrets, setSelectedFrets] = useState({
    lowStringE: 1,
    stringA: 1,
    stringD: 1,
    stringG: 1,
    stringB: 1,
    highStringE: 1
  })
  const handleFretSelect = (stringName, fretNum) => {
    setSelectedFrets((prev) => ({
      ...prev,
      [stringName]: fretNum,
    }))
  }

  return (
    <div>
      <br></br>
      <div id="divOpenFret">
        <p>Click here for an open fret strum</p>
        <p id="openFret"></p>
    </div>
    <div id="fretBoard">
        {strings.map((stringName) => (
            <div key={stringName} className="string-block">
                <label>
                    <input
                        type="radio"
                        name={stringName}
                        value="open"
                    />
                    Open
                </label>
                {frets.map((fretNum) => (
                    <div key={'${stringName}-fret-${fretNum}'} className="fret">
                        <input
                            type="radio"
                            name={stringName}
                            value={`${stringName}Fret${fretNum}`}
                            onClick={() => handleFretSelect(stringName, fretNum)}
                        />
                    </div>
                ))}
            </div>
        ))}
    </div>
    <div id="gtrStringDiv">
        <div id="strings">
            {strings.map((stringName) => {
                const fretNum = selectedFrets[stringName];
                return (
                    <button
                    className="gtrString"
                    id={stringName}
                    key={`${stringName}`}
                    onMouseOver={() => strumGuitar(stringName, fretNum)}
                >
              </button>
            );
        })}
        </div>
    </div>
    <div class="chordDD">
        <div id="chordName">
            <select id="chordSelect" name="Chord" value="Chord">
                <option value="" selected="selected">Please select a chord</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="DMinor">D Minor</option>
                <option value="E">E</option>
                <option value="G">G</option>
            </select>
            <button id="chordSubmit">Submit</button>
        </div>
    </div>
    </div>
  );

  function strumGuitar(stringName, fretNum) {
    const baseFrequency = 82.41;
    const hsFromE2 = {
                        lowStringE: 0, 
                        stringA: 5, 
                        stringD: 10, 
                        stringG: 15, 
                        stringB: 19, 
                        highStringE: 24
                    }
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const semitoneOffset = hsFromE2[stringName] + fretNum + 1;
    const frequency = baseFrequency * Math.pow(2, semitoneOffset/12);
    const osc = audioContext.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(frequency, audioContext.currentTime);

    const gainNode = audioContext.createGain();
    gainNode.gain.value = 1;

    osc.connect(gainNode);
    gainNode.connect(audioContext.destination);

    osc.start();
    console.log(frequency);
    setTimeout(() => {
        osc.stop();
    }, 1000);
  }
 
} 