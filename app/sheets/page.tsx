'use client';

import { useState, useEffect, useCallback, SetStateAction } from 'react';
import ABCJS from 'abcjs';
import Navbar from '../components/Navbar';

export default function MusicEditor() {
  const [abcNotation, setAbcNotation] = useState("X:1\nT:New Score\nM:4/4\nL:1/4\nK:C\nC D E F | G A B c |");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const updateNotation = useCallback((symbol: string) => {
    setAbcNotation((prev) => prev + ' ' + symbol);
    setActiveDropdown(null); // Close dropdown after selection
  }, []);

  useEffect(() => {
    ABCJS.renderAbc("music-display", abcNotation, { responsive: 'resize' });
  }, [abcNotation]);

  const handleTextareaChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setAbcNotation(e.target.value);
  };

  const exportAsImage = () => {
    // Create a temporary div to render the notation
    const tempDiv = document.createElement('div');
    tempDiv.id = 'temp-export';
    document.body.appendChild(tempDiv);
    
    // Render the notation to SVG
    ABCJS.renderAbc(tempDiv, abcNotation, { responsive: 'resize' });
    
    // Get the SVG element
    const svgElement = tempDiv.querySelector('svg');
    
    if (svgElement) {
      // Convert SVG to data URL
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        // Convert to PNG and download
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = 'music-notation.png';
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    }
    
    // Clean up
    document.body.removeChild(tempDiv);
  };

  const toggleDropdown = (dropdownName: string) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white text-black p-4 flex flex-col md:flex-row items-start">
        {/* Sidebar Controls */}
        <div className="w-full md:w-1/4 p-4 bg-gray-200 rounded shadow-md flex flex-col space-y-4">
          <h2 className="text-lg font-bold mb-2">Controls</h2>

          {/* Notes Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('notes')}
              className="w-full p-2 bg-blue-500 text-white rounded flex justify-between items-center"
            >
              Notes
              <span>{activeDropdown === 'notes' ? '▲' : '▼'}</span>
            </button>
            {activeDropdown === 'notes' && (
              <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg p-2 grid grid-cols-3 gap-1">
                {["C", "D", "E", "F", "G", "A", "B", "c", "d", "e", "f", "g"].map((note) => (
                  <button
                    key={note}
                    onClick={() => updateNotation(note)}
                    className="p-2 bg-blue-100 hover:bg-blue-200 rounded text-center"
                    title={`Add note ${note}`}
                  >
                    {note}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Time Signature Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('time')}
              className="w-full p-2 bg-green-500 text-white rounded flex justify-between items-center"
            >
              Time Signature
              <span>{activeDropdown === 'time' ? '▲' : '▼'}</span>
            </button>
            {activeDropdown === 'time' && (
              <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg p-2 grid grid-cols-2 gap-1">
                {["M:4/4", "M:3/4", "M:6/8", "M:2/4", "M:5/4", "M:12/8"].map((ts) => (
                  <button
                    key={ts}
                    onClick={() => updateNotation(ts)}
                    className="p-2 bg-green-100 hover:bg-green-200 rounded text-center"
                    title={`Set time signature to ${ts.replace('M:', '')}`}
                  >
                    {ts.replace('M:', '')}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Key Signature Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('key')}
              className="w-full p-2 bg-yellow-500 text-white rounded flex justify-between items-center"
            >
              Key Signature
              <span>{activeDropdown === 'key' ? '▲' : '▼'}</span>
            </button>
            {activeDropdown === 'key' && (
              <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg p-2 grid grid-cols-2 gap-1">
                {["K:C", "K:G", "K:F", "K:D", "K:Bb", "K:A", "K:Am", "K:Dm", "K:Em", "K:Gm"].map((ks) => (
                  <button
                    key={ks}
                    onClick={() => updateNotation(ks)}
                    className="p-2 bg-yellow-100 hover:bg-yellow-200 rounded text-center"
                    title={`Set key signature to ${ks.replace('K:', '')}`}
                  >
                    {ks.replace('K:', '')}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Clefs Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('clefs')}
              className="w-full p-2 bg-cyan-500 text-white rounded flex justify-between items-center"
            >
              Clefs
              <span>{activeDropdown === 'clefs' ? '▲' : '▼'}</span>
            </button>
            {activeDropdown === 'clefs' && (
              <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg p-2 grid grid-cols-2 gap-1">
                {["treble", "bass", "alto", "tenor", "percussion", "none"].map((clef) => (
                  <button
                    key={clef}
                    onClick={() => updateNotation(`[K:${clef}]`)}
                    className="p-2 bg-cyan-100 hover:bg-cyan-200 rounded text-center"
                    title={`Set clef to ${clef}`}
                  >
                    {clef}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Rhythmic Values Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('rhythm')}
              className="w-full p-2 bg-pink-500 text-white rounded flex justify-between items-center"
            >
              Note Lengths
              <span>{activeDropdown === 'rhythm' ? '▲' : '▼'}</span>
            </button>
            {activeDropdown === 'rhythm' && (
              <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg p-2 grid grid-cols-2 gap-1">
                {["L:1/1", "L:1/2", "L:1/4", "L:1/8", "L:1/16", "L:1/32"].map((rhythm) => (
                  <button
                    key={rhythm}
                    onClick={() => updateNotation(rhythm)}
                    className="p-2 bg-pink-100 hover:bg-pink-200 rounded text-center"
                    title={`Set rhythmic value to ${rhythm.replace('L:', '')}`}
                  >
                    {rhythm.replace('L:', '')}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Accidentals Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('accidentals')}
              className="w-full p-2 bg-orange-500 text-white rounded flex justify-between items-center"
            >
              Accidentals
              <span>{activeDropdown === 'accidentals' ? '▲' : '▼'}</span>
            </button>
            {activeDropdown === 'accidentals' && (
              <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg p-2 grid grid-cols-3 gap-1">
                {["^C", "_C", "=C", "^D", "_D", "=D", "^F", "_F", "=F", "^G", "_G", "=G"].map((accidental) => (
                  <button
                    key={accidental}
                    onClick={() => updateNotation(accidental)}
                    className="p-2 bg-orange-100 hover:bg-orange-200 rounded text-center"
                    title={`Add accidental ${accidental}`}
                  >
                    {accidental}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dynamics Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('dynamics')}
              className="w-full p-2 bg-red-500 text-white rounded flex justify-between items-center"
            >
              Dynamics
              <span>{activeDropdown === 'dynamics' ? '▲' : '▼'}</span>
            </button>
            {activeDropdown === 'dynamics' && (
              <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg p-2 grid grid-cols-3 gap-1">
                {["!ppp!", "!pp!", "!p!", "!mp!", "!mf!", "!f!", "!ff!", "!fff!"].map((dynamic) => (
                  <button
                    key={dynamic}
                    onClick={() => updateNotation(dynamic)}
                    className="p-2 bg-red-100 hover:bg-red-200 rounded text-center"
                    title={`Add dynamic ${dynamic.replace(/!/g, '')}`}
                  >
                    {dynamic.replace(/!/g, '')}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tempo Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('tempo')}
              className="w-full p-2 bg-teal-500 text-white rounded flex justify-between items-center"
            >
              Tempo
              <span>{activeDropdown === 'tempo' ? '▲' : '▼'}</span>
            </button>
            {activeDropdown === 'tempo' && (
              <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg p-2 grid grid-cols-2 gap-1">
                {["Q:1/4=40", "Q:1/4=60", "Q:1/4=80", "Q:1/4=100", "Q:1/4=120", "Q:1/4=160"].map((tempo) => (
                  <button
                    key={tempo}
                    onClick={() => updateNotation(tempo)}
                    className="p-2 bg-teal-100 hover:bg-teal-200 rounded text-center"
                    title={`Set tempo to ${tempo.replace('Q:1/4=', '')}`}
                  >
                    {tempo.replace('Q:1/4=', '')}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Music Display & Editor */}
        <div className="flex flex-col w-full md:w-3/4 p-4">
          <h1 className="text-3xl font-bold mb-4 text-cyan-700">🎼 ABC Notation Music Editor</h1>

          <div id="music-display" className="border p-4 bg-gray-100 w-full shadow-md mb-4"></div>

          {/* ABC Notation Editor */}
          <textarea
            className="border p-2 w-full h-40"
            value={abcNotation}
            onChange={handleTextareaChange}
            aria-label="ABC Notation Editor"
          />

          {/* Export Button */}
          <button
            onClick={exportAsImage}
            className="mt-4 p-2 bg-green-600 text-white rounded flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export as PNG
          </button>

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