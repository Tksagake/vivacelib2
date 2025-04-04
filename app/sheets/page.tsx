'use client';

import { useState, useEffect, useCallback, SetStateAction } from 'react';
import ABCJS from 'abcjs';
import Navbar from '../components/Navbar';

export default function MusicEditor() {
  const [abcNotation, setAbcNotation] = useState("X:1\nT:New Score\nM:4/4\nL:1/4\nK:C\nC D E F | G A B c |");

  const updateNotation = useCallback((symbol: string) => {
    setAbcNotation((prev) => prev + ' ' + symbol);
  }, []);

  useEffect(() => {
    ABCJS.renderAbc("music-display", abcNotation, { responsive: 'resize' });
  }, [abcNotation]);

  const handleTextareaChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setAbcNotation(e.target.value);
  };

  const playMusic = () => {
    // First render the ABC notation to get the Tune object
    const tune = ABCJS.renderAbc("music-display", abcNotation)[0];
    
    if (tune) {
      // Create a new SynthController instance
      const synthControl = new ABCJS.synth.SynthController();
      
      // Set up the audio container
      synthControl.setTune(tune, false, { 
        display: true,
        displayNotes: true,
        displayClef: true,
        displayPlay: true,
        displayRestart: true,
        displayProgress: true,
      }).then(() => {
        console.log("Audio successfully loaded");
      }).catch((error: Error) => {
        console.error("Error loading audio:", error);
      });
    } else {
      console.error("Failed to render ABC notation.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white text-black p-4 flex flex-col md:flex-row items-start">
        {/* Sidebar Controls */}
        <div className="w-full md:w-1/4 p-4 bg-gray-200 rounded shadow-md flex flex-col space-y-4">
          <h2 className="text-lg font-bold mb-2">Controls</h2>

          {/* Note Buttons */}
          <div className="flex flex-wrap gap-2">
            {["C", "D", "E", "F", "G", "A", "B"].map((note) => (
              <button
                key={note}
                onClick={() => updateNotation(note)}
                className="p-2 bg-blue-500 text-white rounded"
                title={`Add note ${note}`}
              >
                {note}
              </button>
            ))}
          </div>

          {/* Time Signature */}
          <div>
            <h3 className="font-semibold">Time Signature</h3>
            <div className="flex gap-2 flex-wrap">
              {["M:4/4", "M:3/4", "M:6/8"].map((ts) => (
                <button
                  key={ts}
                  onClick={() => updateNotation(ts)}
                  className="p-2 bg-green-500 text-white rounded"
                  title={`Set time signature to ${ts.replace('M:', '')}`}
                >
                  {ts.replace('M:', '')}
                </button>
              ))}
            </div>
          </div>

          {/* Key Signature */}
          <div>
            <h3 className="font-semibold">Key Signature</h3>
            <div className="flex gap-2 flex-wrap">
              {["K:C", "K:G", "K:F"].map((ks) => (
                <button
                  key={ks}
                  onClick={() => updateNotation(ks)}
                  className="p-2 bg-yellow-500 text-white rounded"
                  title={`Set key signature to ${ks.replace('K:', '')}`}
                >
                  {ks.replace('K:', '')}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Controls */}
          <div>
            <h3 className="font-semibold">Clefs</h3>
            <div className="flex gap-2 flex-wrap">
              {["treble", "bass", "alto", "tenor"].map((clef) => (
                <button
                  key={clef}
                  onClick={() => updateNotation(`[K:${clef}]`)}
                  className="p-2 bg-purple-500 text-white rounded"
                  title={`Set clef to ${clef}`}
                >
                  {clef}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold">Rhythmic Values</h3>
            <div className="flex gap-2 flex-wrap">
              {["L:1/4", "L:1/8", "L:1/16"].map((rhythm) => (
                <button
                  key={rhythm}
                  onClick={() => updateNotation(rhythm)}
                  className="p-2 bg-pink-500 text-white rounded"
                  title={`Set rhythmic value to ${rhythm.replace('L:', '')}`}
                >
                  {rhythm.replace('L:', '')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold">Accidentals</h3>
            <div className="flex gap-2 flex-wrap">
              {["^C", "_C", "=C"].map((accidental) => (
                <button
                  key={accidental}
                  onClick={() => updateNotation(accidental)}
                  className="p-2 bg-orange-500 text-white rounded"
                  title={`Add accidental ${accidental}`}
                >
                  {accidental}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold">Dynamics</h3>
            <div className="flex gap-2 flex-wrap">
              {["!pp!", "!p!", "!mp!", "!mf!", "!f!", "!ff!"].map((dynamic) => (
                <button
                  key={dynamic}
                  onClick={() => updateNotation(dynamic)}
                  className="p-2 bg-red-500 text-white rounded"
                  title={`Add dynamic ${dynamic.replace(/!/g, '')}`}
                >
                  {dynamic.replace(/!/g, '')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold">Tempo Marks</h3>
            <div className="flex gap-2 flex-wrap">
              {["Q:1/4=60", "Q:1/4=120"].map((tempo) => (
                <button
                  key={tempo}
                  onClick={() => updateNotation(tempo)}
                  className="p-2 bg-teal-500 text-white rounded"
                  title={`Set tempo to ${tempo.replace('Q:1/4=', '')}`}
                >
                  {tempo.replace('Q:1/4=', '')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Music Display & Editor */}
        <div className="flex flex-col w-full md:w-3/4 p-4">
          <h1 className="text-3xl font-bold mb-4 text-purple-700">🎼 ABC Notation Music Editor</h1>

          <div id="music-display" className="border p-4 bg-gray-100 w-full shadow-md mb-4"></div>

          {/* ABC Notation Editor */}
          <textarea
            className="border p-2 w-full h-40"
            value={abcNotation}
            onChange={handleTextareaChange}
            aria-label="ABC Notation Editor"
          />

          {/* Play Button and Audio Controls */}
          <div className="mt-4 flex flex-col gap-2">
            <button
              onClick={playMusic}
              className="p-2 bg-blue-600 text-white rounded"
            >
              ▶️ Play Music
            </button>
            <div id="audio" className="w-full"></div>
          </div>

          {/* Tutorial Section */}
          <div className="mt-6 p-4 bg-gray-200 rounded shadow-md">
            <h2 className="text-xl font-bold mb-2">📖 How to Use ABC Notation</h2>
            <p className="mb-2">ABC notation is a simple way to write music using text.</p>
            <ul className="list-disc list-inside mb-2">
              <li><strong>Notes:</strong> C D E F G A B (Uppercase for lower notes, lowercase for higher notes)</li>
              <li><strong>Chords:</strong> Use square brackets, e.g., [C E G]</li>
              <li><strong>Time Signature:</strong> M:4/4 (4 beats per measure)</li>
              <li><strong>Key Signature:</strong> K:C (C Major), K:G (G Major), etc.</li>
              <li><strong>Bar Lines:</strong> | (separates measures)</li>
              <li><strong>Clefs:</strong> [K:treble], [K:bass], etc.</li>
              <li><strong>Rhythmic Values:</strong> L:1/4, L:1/8, etc.</li>
              <li><strong>Accidentals:</strong> ^C (sharp), _C (flat), =C (natural)</li>
              <li><strong>Dynamics:</strong> !pp!, !p!, !f!, etc.</li>
              <li><strong>Tempo Marks:</strong> Q:1/4=60, Q:1/4=120, etc.</li>
            </ul>
            <p>Try typing in the box above and see your music render automatically!</p>
          </div>
        </div>
      </div>
    </>
  );
}