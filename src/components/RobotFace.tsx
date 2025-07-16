import { useEffect, useRef } from "react";

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

  const speakPhrase = () => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const randomPhrase = SILLY_PHRASES[Math.floor(Math.random() * SILLY_PHRASES.length)];
      
      const utterance = new SpeechSynthesisUtterance(randomPhrase);
      utterance.rate = 1.3; // Slightly faster
      utterance.pitch = 1.8; // High-pitched
      utterance.volume = 0.8;
      
      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    const getRandomInterval = () => Math.random() * 10000 + 20000; // 20-30 seconds
    
    let timeout: NodeJS.Timeout;
    
    const scheduleNextPhrase = () => {
      const interval = getRandomInterval();
      timeout = setTimeout(() => {
        speakPhrase();
        scheduleNextPhrase(); // Schedule the next one
      }, interval);
    };

    // Start the cycle
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
  }, []);

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center">
      <div className="flex items-center gap-24">
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