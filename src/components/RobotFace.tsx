import { useEffect, useRef, useState } from "react";

const SILLY_PHRASES = [
  "SOCKS ARE GOOD",
  "TOAST IS JUST HOT BREAD",
  "I LIKE BISCUITS",
  "BANANAS ARE YELLOW MAGIC",
  "RAIN IS SKY WATER",
  "CATS HAVE TOO MANY TOES",
  "CHEESE IS MILK'S FINAL FORM",
  "DOORKNOBS ARE ROUND SERVANTS",
  "CLOUDS ARE FLUFFY SKY SHEEP",
  "SPOONS ARE TINY METAL SHOVELS",
  "HATS ARE HEAD BLANKETS",
  "WINDOWS ARE WALL HOLES",
  "BUTTONS HAVE ONE JOB",
  "PILLOWS ARE DREAM CUSHIONS",
  "KEYS UNLOCK MYSTERIES"
];

const RobotFace = () => {
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [showTapMessage, setShowTapMessage] = useState(true);

  const enableSpeech = () => {
    if ('speechSynthesis' in window && !speechEnabled) {
      // Test speech to enable it on iOS Safari
      const testUtterance = new SpeechSynthesisUtterance("");
      window.speechSynthesis.speak(testUtterance);
      setSpeechEnabled(true);
      setShowTapMessage(false);
      speakPhrase();
    }
  };

  const speakPhrase = () => {
    if ('speechSynthesis' in window && speechEnabled) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const randomPhrase = SILLY_PHRASES[Math.floor(Math.random() * SILLY_PHRASES.length)];
      
      const utterance = new SpeechSynthesisUtterance(randomPhrase);
      
      // Slower rate for mobile devices, normal rate for desktop
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      utterance.rate = isMobile ? 0.7 : 1.0; // Much slower on mobile
      utterance.pitch = 1.8; // High-pitched
      utterance.volume = 0.8;
      
      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (!speechEnabled) return;
    
    const getRandomInterval = () => Math.random() * 10000 + 20000; // 20-30 seconds
    
    let timeout: NodeJS.Timeout;
    
    const scheduleNextPhrase = () => {
      const interval = getRandomInterval();
      timeout = setTimeout(() => {
        speakPhrase();
        scheduleNextPhrase(); // Schedule the next one
      }, interval);
    };

    // Start the cycle only after speech is enabled
    scheduleNextPhrase();

    // Cleanup function
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
      if (speechRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, [speechEnabled]);

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center relative">
      {showTapMessage && (
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-neon-blue/20 border border-neon-blue/50 rounded-lg p-4 text-center">
          <p className="text-foreground text-sm">Tap anywhere to enable robot voice</p>
        </div>
      )}
      
      <div 
        className="flex items-center gap-24 cursor-pointer" 
        onClick={enableSpeech}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && enableSpeech()}
      >
        {/* Left Eye */}
        <div className="relative">
          <div 
            className="w-32 h-32 rounded-full border-4 border-neon-blue animate-glow-pulse"
            style={{
              background: 'transparent'
            }}
          />
        </div>
        
        {/* Right Eye */}
        <div className="relative">
          <div 
            className="w-32 h-32 rounded-full border-4 border-neon-blue animate-glow-pulse"
            style={{
              background: 'transparent'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default RobotFace;