// import React, { useEffect, useRef, useState } from 'react';
// import './VoiceToText.css';

// const VoiceToText = () => {
//   const [isListening, setIsListening] = useState(false);
//   const [finalTranscript, setFinalTranscript] = useState('');
//   const [interimTranscript, setInterimTranscript] = useState('');
//   const [showInterim, setShowInterim] = useState(false);

//   const recognitionRef = useRef(null);
//   const interimTimeoutRef = useRef(null);
//   const textareaRef = useRef(null); // for auto-scroll

//   // Auto-scroll to bottom on finalTranscript change
//   useEffect(() => {
//     if (textareaRef.current) {
//       textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
//     }
//   }, [finalTranscript]);

//   useEffect(() => {
//     if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
//       alert('Your browser does not support the Web Speech API.');
//       return;
//     }

//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     const recognition = new SpeechRecognition();

//     recognition.continuous = true;
//     recognition.interimResults = true;
//     recognition.lang = 'en-US';

//     recognition.onresult = (event) => {
//       let interim = '';

//       for (let i = event.resultIndex; i < event.results.length; ++i) {
//         const transcript = event.results[i][0].transcript;

//         if (event.results[i].isFinal) {
//           setFinalTranscript(prev => prev + ' ' + interimTranscript + transcript + ' ');
//           setInterimTranscript('');
//           setShowInterim(false);
//           return;
//         } else {
//           interim += transcript;
//         }
//       }

//       if (interim) {
//         setInterimTranscript(interim);
//         setShowInterim(true);
//         clearTimeout(interimTimeoutRef.current);
//         interimTimeoutRef.current = setTimeout(() => setShowInterim(false), 2000);
//       }
//     };

//     recognition.onerror = (event) => {
//       console.error('Speech recognition error:', event.error);
//     };

//     recognitionRef.current = recognition;
//   }, []);

//   const toggleMic = () => {
//     if (!recognitionRef.current) return;
//     if (!isListening) recognitionRef.current.start();
//     else recognitionRef.current.stop();
//     setIsListening(prev => !prev);
//   };

//   const handleFinalEdit = (e) => {
//     setFinalTranscript(e.target.value);
//   };

//   return (
//     <div className="voice-container">
//       <h2>🎙️ Voice to Text</h2>
//       <button
//         className={`mic-btn ${isListening ? 'mic-off' : 'mic-on'}`}
//         onClick={toggleMic}
//       >
//         🎤
//       </button>

//       <div className="result-box">
//         <label><strong>Final Transcript (Editable):</strong></label>
//         <textarea
//           ref={textareaRef}
//           value={finalTranscript}
//           onChange={handleFinalEdit}
//           className="final-textarea"
//           rows={6}
//         />
//       </div>

//       <div className={`interim-bubble ${showInterim ? 'show' : ''}`}>
//         {interimTranscript}
//       </div>
//     </div>
//   );
// };

// export default VoiceToText;
