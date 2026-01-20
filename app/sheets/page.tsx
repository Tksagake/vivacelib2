'use client';

import { useState, useEffect, useCallback, SetStateAction } from 'react';
import ABCJS from 'abcjs';
import Navbar from '../components/Navbar';
import { Download, Music, ChevronDown, ChevronUp, FileMusic, Info, Keyboard, Clock, Sliders, Volume2, Hash } from 'lucide-react';

export default function MusicEditor() {
  const [abcNotation, setAbcNotation] = useState("X:1\nT:New Score\nM:4/4\nL:1/4\nK:C\nC D E F | G A B c |");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const updateNotation = useCallback((symbol: string) => {
    setAbcNotation((prev) => prev + ' ' + symbol);
    setActiveDropdown(null);
  }, []);

  useEffect(() => {
    ABCJS.renderAbc("music-display", abcNotation, { 
      responsive: 'resize',
      staffwidth: 800,
    });
  }, [abcNotation]);

  const handleTextareaChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setAbcNotation(e.target.value);
  };

  const exportAsImage = () => {
    const tempDiv = document.createElement('div');
    tempDiv.id = 'temp-export';
    document.body.appendChild(tempDiv);
    
    ABCJS.renderAbc(tempDiv, abcNotation, { responsive: 'resize' });
    
    const svgElement = tempDiv.querySelector('svg');
    
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = 'music-notation.png';
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    }
    
    document.body.removeChild(tempDiv);
  };

  const toggleDropdown = (dropdownName: string) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const controlGroups = [
    {
      id: 'notes',
      label: 'Notes',
      icon: Music,
      color: 'bg-[var(--primary-600)]',
      hoverColor: 'hover:bg-[var(--primary-700)]',
      items: ["C", "D", "E", "F", "G", "A", "B", "c", "d", "e", "f", "g"],
      itemBg: 'bg-[var(--primary-50)]',
      itemHover: 'hover:bg-[var(--primary-100)]',
    },
    {
      id: 'time',
      label: 'Time Signature',
      icon: Clock,
      color: 'bg-[var(--secondary-600)]',
      hoverColor: 'hover:bg-[var(--secondary-700)]',
      items: ["M:4/4", "M:3/4", "M:6/8", "M:2/4", "M:5/4", "M:12/8"],
      itemBg: 'bg-[var(--secondary-50)]',
      itemHover: 'hover:bg-[var(--secondary-100)]',
      formatItem: (item: string) => item.replace('M:', ''),
    },
    {
      id: 'key',
      label: 'Key Signature',
      icon: Keyboard,
      color: 'bg-[var(--accent-600)]',
      hoverColor: 'hover:bg-[var(--accent-700)]',
      items: ["K:C", "K:G", "K:F", "K:D", "K:Bb", "K:A", "K:Am", "K:Dm", "K:Em", "K:Gm"],
      itemBg: 'bg-[var(--accent-50)]',
      itemHover: 'hover:bg-[var(--accent-100)]',
      formatItem: (item: string) => item.replace('K:', ''),
    },
    {
      id: 'clefs',
      label: 'Clefs',
      icon: FileMusic,
      color: 'bg-purple-600',
      hoverColor: 'hover:bg-purple-700',
      items: ["treble", "bass", "alto", "tenor", "percussion", "none"],
      itemBg: 'bg-purple-50',
      itemHover: 'hover:bg-purple-100',
      addSymbol: (item: string) => `[K:${item}]`,
    },
    {
      id: 'rhythm',
      label: 'Note Lengths',
      icon: Sliders,
      color: 'bg-pink-600',
      hoverColor: 'hover:bg-pink-700',
      items: ["L:1/1", "L:1/2", "L:1/4", "L:1/8", "L:1/16", "L:1/32"],
      itemBg: 'bg-pink-50',
      itemHover: 'hover:bg-pink-100',
      formatItem: (item: string) => item.replace('L:', ''),
    },
    {
      id: 'accidentals',
      label: 'Accidentals',
      icon: Hash,
      color: 'bg-orange-600',
      hoverColor: 'hover:bg-orange-700',
      items: ["^C", "_C", "=C", "^D", "_D", "=D", "^F", "_F", "=F", "^G", "_G", "=G"],
      itemBg: 'bg-orange-50',
      itemHover: 'hover:bg-orange-100',
    },
    {
      id: 'dynamics',
      label: 'Dynamics',
      icon: Volume2,
      color: 'bg-red-600',
      hoverColor: 'hover:bg-red-700',
      items: ["!ppp!", "!pp!", "!p!", "!mp!", "!mf!", "!f!", "!ff!", "!fff!"],
      itemBg: 'bg-red-50',
      itemHover: 'hover:bg-red-100',
      formatItem: (item: string) => item.replace(/!/g, ''),
    },
    {
      id: 'tempo',
      label: 'Tempo',
      icon: Clock,
      color: 'bg-teal-600',
      hoverColor: 'hover:bg-teal-700',
      items: ["Q:1/4=40", "Q:1/4=60", "Q:1/4=80", "Q:1/4=100", "Q:1/4=120", "Q:1/4=160"],
      itemBg: 'bg-teal-50',
      itemHover: 'hover:bg-teal-100',
      formatItem: (item: string) => item.replace('Q:1/4=', '') + ' BPM',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-br from-purple-800 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center">
              <FileMusic size={28} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Score Editor</h1>
              <p className="text-white/70">Create and edit musical scores using ABC notation</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Controls Sidebar */}
          <div className="lg:col-span-1 space-y-3">
            <h2 className="text-lg font-semibold text-[var(--primary-900)] mb-4">Controls</h2>
            
            {controlGroups.map((group) => (
              <div key={group.id} className="relative">
                <button
                  onClick={() => toggleDropdown(group.id)}
                  className={`w-full flex items-center justify-between gap-2 px-4 py-3 ${group.color} ${group.hoverColor} text-white rounded-lg transition-colors`}
                >
                  <div className="flex items-center gap-2">
                    <group.icon size={18} />
                    <span className="font-medium">{group.label}</span>
                  </div>
                  {activeDropdown === group.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                
                {activeDropdown === group.id && (
                  <div className="absolute z-10 mt-2 w-full bg-white border border-[var(--neutral-200)] rounded-lg shadow-lg p-2 grid grid-cols-3 gap-1">
                    {group.items.map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          const symbol = group.addSymbol ? group.addSymbol(item) : item;
                          updateNotation(symbol);
                        }}
                        className={`p-2 ${group.itemBg} ${group.itemHover} rounded text-center text-sm font-medium text-[var(--neutral-800)] transition-colors`}
                        title={`Add ${item}`}
                      >
                        {group.formatItem ? group.formatItem(item) : item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Export Button */}
            <button
              onClick={exportAsImage}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[var(--secondary-600)] hover:bg-[var(--secondary-700)] text-white rounded-lg transition-colors mt-6"
            >
              <Download size={18} />
              <span className="font-medium">Export as PNG</span>
            </button>
          </div>

          {/* Main Editor Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Score Display */}
            <div className="bg-white rounded-xl border border-[var(--neutral-200)] overflow-hidden">
              <div className="p-4 border-b border-[var(--neutral-200)] flex items-center justify-between">
                <h3 className="font-semibold text-[var(--primary-900)]">Score Preview</h3>
                <span className="text-sm text-[var(--neutral-500)]">Live rendering</span>
              </div>
              <div 
                id="music-display" 
                className="p-6 bg-white min-h-[200px]"
                style={{ overflow: 'auto' }}
              ></div>
            </div>

            {/* ABC Notation Editor */}
            <div className="bg-white rounded-xl border border-[var(--neutral-200)] overflow-hidden">
              <div className="p-4 border-b border-[var(--neutral-200)]">
                <h3 className="font-semibold text-[var(--primary-900)]">ABC Notation</h3>
              </div>
              <textarea
                className="w-full p-4 min-h-[160px] font-mono text-sm text-[var(--neutral-800)] focus:outline-none resize-y border-none"
                value={abcNotation}
                onChange={handleTextareaChange}
                aria-label="ABC Notation Editor"
                placeholder="Enter your ABC notation here..."
              />
            </div>

            {/* Tutorial Section */}
            <div className="bg-gradient-to-br from-[var(--primary-50)] to-[var(--secondary-50)] rounded-xl border border-[var(--primary-200)] p-6">
              <div className="flex items-center gap-2 mb-4">
                <Info size={20} className="text-[var(--primary-600)]" />
                <h3 className="text-lg font-semibold text-[var(--primary-900)]">ABC Notation Guide</h3>
              </div>
              <p className="text-[var(--neutral-700)] mb-4">
                ABC notation is a simple text-based format for writing music. Here are the basics:
              </p>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <span className="font-mono bg-white px-2 py-0.5 rounded text-[var(--primary-700)]">C D E F G A B</span>
                    <span className="text-[var(--neutral-600)]">Lower octave</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-mono bg-white px-2 py-0.5 rounded text-[var(--primary-700)]">c d e f g a b</span>
                    <span className="text-[var(--neutral-600)]">Higher octave</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-mono bg-white px-2 py-0.5 rounded text-[var(--primary-700)]">[C E G]</span>
                    <span className="text-[var(--neutral-600)]">Chord</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-mono bg-white px-2 py-0.5 rounded text-[var(--primary-700)]">|</span>
                    <span className="text-[var(--neutral-600)]">Bar line</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <span className="font-mono bg-white px-2 py-0.5 rounded text-[var(--primary-700)]">^C</span>
                    <span className="text-[var(--neutral-600)]">Sharp</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-mono bg-white px-2 py-0.5 rounded text-[var(--primary-700)]">_C</span>
                    <span className="text-[var(--neutral-600)]">Flat</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-mono bg-white px-2 py-0.5 rounded text-[var(--primary-700)]">=C</span>
                    <span className="text-[var(--neutral-600)]">Natural</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-mono bg-white px-2 py-0.5 rounded text-[var(--primary-700)]">M:4/4</span>
                    <span className="text-[var(--neutral-600)]">Time signature</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
