
// UI Control Functions
function showEncryption() {
    document.getElementById('enigma-encrypt').style.display = 'block';
    document.getElementById('enigma-decrypt').style.display = 'none';
}

function showDecryption() {
    document.getElementById('enigma-encrypt').style.display = 'none';
    document.getElementById('enigma-decrypt').style.display = 'block';
}

// Global variables to store machine state
let currentRotors = Array(8).fill('');
let currentReflectors = Array(5).fill('');
let plugboardConnections = new Map();
let selectedPlug = null;

// Initialize the machine on page load
window.onload = function() {
    initializeMachine();
}

// Initialize the machine
function initializeMachine() {
    generateRotors();
    generateReflectors();
    setupPlugboard();
    setupLampboard();
    populateRotorSelections();
    populateReflectorSelection();
}

// Generate random rotor wirings
function generateRotors() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    currentRotors = Array(8).fill('').map(() => {
        return shuffleString(alphabet);
    });
}

// Generate random reflector wirings
function generateReflectors() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    currentReflectors = Array(5).fill('').map(() => {
        return generateReflectorWiring(alphabet);
    });
}

// Generate a valid reflector wiring (pairs of letters)
function generateReflectorWiring(alphabet) {
    let letters = alphabet.split('');
    let wiring = new Array(26).fill('');
    
    while(letters.length > 0) {
        const a = letters.pop();
        if(letters.length === 0) break;
        const b = letters.pop();
        
        const posA = alphabet.indexOf(a);
        const posB = alphabet.indexOf(b);
        
        wiring[posA] = b;
        wiring[posB] = a;
    }
    
    return wiring.join('');
}

// Shuffle a string
function shuffleString(str) {
    const arr = str.split('');
    for(let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
}

// Setup plugboard
function setupPlugboard() {
    const plugboard = document.getElementById('plugboard');
    plugboard.innerHTML = ''; // Clear existing plugboard
    for(let i = 0; i < 26; i++) {
        const plug = document.createElement('div');
        plug.className = 'plug';
        plug.textContent = String.fromCharCode(65 + i);
        plug.onclick = () => connectPlug(plug);
        plugboard.appendChild(plug);
    }
}

// Setup lampboard

function setupLampboard() {
const lampboard = document.getElementById('lampboard');
lampboard.innerHTML = ''; // Clear existing lampboard

// Add letters from A to Z
for(let i = 0; i < 26; i++) {
const lamp = document.createElement('div');
lamp.className = 'lamp';
lamp.id = `lamp-${String.fromCharCode(65 + i)}`;
lamp.textContent = String.fromCharCode(65 + i);
lampboard.appendChild(lamp);
}
}
// Function to light up a lamp
function lightUpLamp(letter) {
// Clear all previously lit lamps
const lamps = document.getElementsByClassName('lamp');
Array.from(lamps).forEach(lamp => lamp.classList.remove('lit'));

// Light up the new lamp
const lamp = document.getElementById(`lamp-${letter}`);
if (lamp) {
lamp.classList.add('lit');
// Remove the lit class after a short delay
setTimeout(() => {
    lamp.classList.remove('lit');
}, 200); // 200ms delay for better visual feedback
}
}

// Function to handle keyboard input
function handleKeyPress(event) {
// Get the pressed key and convert to uppercase
let key = event.key.toUpperCase();

// Only process alphabetic characters
if (/^[A-Z]$/.test(key)) {
// Get current rotor and reflector settings
const rotors = [
    parseInt(document.getElementById('rotor1').value),
    parseInt(document.getElementById('rotor2').value),
    parseInt(document.getElementById('rotor3').value)
];

const positions = [
    parseInt(document.getElementById('position1').value),
    parseInt(document.getElementById('position2').value),
    parseInt(document.getElementById('position3').value)
];

const reflector = parseInt(document.getElementById('reflector').value);

// Process the single character through the Enigma machine
const result = encryptDecrypt(key, rotors, positions, plugboardConnections);

// Light up the corresponding lamp
lightUpLamp(result);

// Update the input and output text areas
const inputText = document.getElementById('input-text');
const outputText = document.getElementById('output-text');
inputText.value += key;
outputText.value += result;

// Prevent default behavior
event.preventDefault();
}
}

// Function to initialize keyboard handlers
function initializeKeyboardHandlers() {
// Add keydown event listener to the document
document.addEventListener('keydown', handleKeyPress);

// Add click handlers to the lampboard
const lamps = document.getElementsByClassName('lamp');
Array.from(lamps).forEach(lamp => {
lamp.addEventListener('click', () => {
    const letter = lamp.textContent;
    const event = new KeyboardEvent('keydown', {
        key: letter,
        bubbles: true
    });
    document.dispatchEvent(event);
});
});
}

// Update the window.onload function
const originalOnload = window.onload;
window.onload = function() {
if (originalOnload) {
originalOnload();
}
initializeMachine();
initializeKeyboardHandlers();
};

// Update the CSS for the lamp animation
const style = document.createElement('style');
style.textContent = `
.lamp.lit {
background: var(--warning);
color: var(--dark);
box-shadow: 0 0 15px var(--warning);
animation: glow 0.2s ease-in-out;
transition: all 0.2s ease;
}

@keyframes glow {
0% { box-shadow: 0 0 5px var(--warning); }
50% { box-shadow: 0 0 20px var(--warning); }
100% { box-shadow: 0 0 5px var(--warning); }
}
`;
document.head.appendChild(style);

// Function to handle lighting up lamps
function handleKeyInput(event) {
// Get previous lit lamp and remove lit class
const prevLit = document.querySelector('.lamp.lit');
if (prevLit) {
prevLit.classList.remove('lit');
}

// Convert input to uppercase and check if it's a letter
const key = event.key.toUpperCase();
if (/^[A-Z]$/.test(key)) {
const lamp = document.getElementById(`lamp-${key}`);
if (lamp) {
    lamp.classList.add('lit');
}
}
}

// Initialize the Enigma lampboard
function initEnigmaLampboard() {
setupLampboard();
// Add event listener to the document for keydown events
document.addEventListener('keydown', handleKeyInput);
}

// Call initialization when the document is ready
document.addEventListener('DOMContentLoaded', initEnigmaLampboard);

// Populate rotor selections
function populateRotorSelections() {
    const rotors = [
        document.getElementById('rotor1'),
        document.getElementById('rotor2'),
        document.getElementById('rotor3')
    ];

    rotors.forEach((rotor, index) => {
        rotor.innerHTML = '';
        for(let i = 0; i < 8; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `Rotor ${i + 1}`;
            rotor.appendChild(option);
        }
        rotor.value = index;
    });
}

// Populate reflector selection
function populateReflectorSelection() {
    const reflector = document.getElementById('reflector');
    reflector.innerHTML = '';
    for(let i = 0; i < 5; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `Reflector ${String.fromCharCode(65 + i)}`;
        reflector.appendChild(option);
    }
}

// Handle plugboard connections
function connectPlug(plug) {
    if(selectedPlug === null) {
        selectedPlug = plug;
        plug.classList.add('selected');
    } else if(selectedPlug === plug) {
        selectedPlug.classList.remove('selected');
        selectedPlug = null;
    } else {
        const letter1 = selectedPlug.textContent;
        const letter2 = plug.textContent;
        
        // Remove existing connections
        if(plugboardConnections.has(letter1)) {
            const oldPair = plugboardConnections.get(letter1);
            const oldPlug = Array.from(document.getElementsByClassName('plug'))
                .find(p => p.textContent === oldPair);
            if(oldPlug) oldPlug.classList.remove('connected');
            plugboardConnections.delete(oldPair);
        }
        if(plugboardConnections.has(letter2)) {
            const oldPair = plugboardConnections.get(letter2);
            const oldPlug = Array.from(document.getElementsByClassName('plug'))
                .find(p => p.textContent === oldPair);
            if(oldPlug) oldPlug.classList.remove('connected');
            plugboardConnections.delete(oldPair);
        }
        
        // Add new connection
        plugboardConnections.set(letter1, letter2);
        plugboardConnections.set(letter2, letter1);
        
        selectedPlug.classList.remove('selected');
        selectedPlug.classList.add('connected');
        plug.classList.add('connected');
        
        selectedPlug = null;
    }
}

// Process text (encrypt or decrypt)
function processText(mode) {
    if(mode === 'encrypt') {
        const input = document.getElementById('input-text').value.toUpperCase();
        const rotorPositions = [
            parseInt(document.getElementById('position1').value),
            parseInt(document.getElementById('position2').value),
            parseInt(document.getElementById('position3').value)
        ];
        
        const selectedRotors = [
            parseInt(document.getElementById('rotor1').value),
            parseInt(document.getElementById('rotor2').value),
            parseInt(document.getElementById('rotor3').value)
        ];
        
        const selectedReflector = parseInt(document.getElementById('reflector').value);
        
        const result = encryptDecrypt(input, selectedRotors, rotorPositions, selectedReflector, plugboardConnections);
        document.getElementById('output-text').value = result;
    } else {
        const input = document.getElementById('decrypt-input').value.toUpperCase();
        
        // Parse decrypt settings
        const rotors = document.getElementById('decrypt-rotors').value.split(',').map(Number);
        const positions = document.getElementById('decrypt-positions').value.split(',').map(Number);
        const reflector = parseInt(document.getElementById('decrypt-reflector').value);
        
        // Parse plugboard settings
        const newPlugboardConnections = new Map();
        const plugboardPairs = document.getElementById('decrypt-plugboard').value.split(',');
        plugboardPairs.forEach(pair => {
            if(pair.length === 2) {
                newPlugboardConnections.set(pair[0], pair[1]);
                newPlugboardConnections.set(pair[1], pair[0]);
            }
        });
        
        // Parse rotor and reflector wirings
        const rotorWirings = document.getElementById('decrypt-rotor-wirings').value.split(',');
        const reflectorWiring = document.getElementById('decrypt-reflector-wiring').value;
        
        // Set the wirings temporarily for decryption
        const tempRotors = [...currentRotors];
        const tempReflectors = [...currentReflectors];
        
        rotorWirings.forEach((wiring, index) => {
            if(wiring.length === 26) currentRotors[index] = wiring;
        });
        currentReflectors[reflector] = reflectorWiring;
        
        const result = encryptDecrypt(input, rotors, positions, reflector, newPlugboardConnections);
        document.getElementById('decrypt-output').value = result;
        
        // Restore original wirings
        currentRotors = tempRotors;
        currentReflectors = tempReflectors;
    }
}

// Main encryption/decryption function
    
// Modified encryption/decryption function with exact position tracking
function encryptDecrypt(input, rotors, initialPositions, reflector, plugboard) {
let result = '';
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Create a copy of initial positions to avoid modifying the original
let positions = initialPositions.map(p => p - 1); // Convert to 0-based positions

// Process each character
for(let i = 0; i < input.length; i++) {
    let char = input[i];
    
    // Skip non-alphabetic characters
    if(!/[A-Z]/.test(char)) {
        result += char;
        continue;
    }
    
    // Step 1: Rotate rotors before processing the character
    // Rotor 1 (rightmost) rotates every time
    positions[0] = (positions[0] + 1) % 26;
    
    // Rotor 2 rotates when Rotor 1 completes a full rotation
    if(positions[0] === 0) {
        positions[1] = (positions[1] + 1) % 26;
        // Rotor 3 rotates when Rotor 2 completes a full rotation
        if(positions[1] === 0) {
            positions[2] = (positions[2] + 1) % 26;
        }
    }
    
    // Step 2: Apply plugboard (forward)
    if(plugboard.has(char)) {
        char = plugboard.get(char);
    }
    
    // Step 3: Through rotors forward
    let pos = alphabet.indexOf(char);
    
    // Through each rotor forward
    for(let j = 0; j < 3; j++) {
        // Calculate offset
        const offset = positions[j];
        // Apply offset
        pos = (pos + offset) % 26;
        // Through rotor
        pos = alphabet.indexOf(currentRotors[rotors[j]][pos]);
        // Remove offset
        pos = (pos - offset + 26) % 26;
    }
    
    // Step 4: Through reflector
    pos = alphabet.indexOf(currentReflectors[reflector][pos]);
    
    // Step 5: Through rotors backward
    for(let j = 2; j >= 0; j--) {
        // Calculate offset
        const offset = positions[j];
        // Apply offset
        pos = (pos + offset) % 26;
        // Through rotor backward
        pos = currentRotors[rotors[j]].indexOf(alphabet[pos]);
        // Remove offset
        pos = (pos - offset + 26) % 26;
    }
    
    // Get resulting character
    char = alphabet[pos];
    
    // Step 6: Apply plugboard (backward)
    if(plugboard.has(char)) {
        char = plugboard.get(char);
    }
    
    // Light up lampboard
    const lamps = document.getElementsByClassName('lamp');
    Array.from(lamps).forEach(lamp => {
        lamp.classList.remove('lit');
        if(lamp.textContent === char) {
            lamp.classList.add('lit');
        }
    });
    
    result += char;
}

return result;
}

// Modified download report function to include complete settings state
function downloadReport() {
const rotors = [
    parseInt(document.getElementById('rotor1').value),
    parseInt(document.getElementById('rotor2').value),
    parseInt(document.getElementById('rotor3').value)
];

const positions = [
    parseInt(document.getElementById('position1').value),
    parseInt(document.getElementById('position2').value),
    parseInt(document.getElementById('position3').value)
];

const reflector = parseInt(document.getElementById('reflector').value);
const input = document.getElementById('input-text').value;
const output = document.getElementById('output-text').value;

// Convert plugboard connections to string format
const plugboardPairs = [];
const used = new Set();
plugboardConnections.forEach((value, key) => {
    if(!used.has(key) && !used.has(value)) {
        plugboardPairs.push(key + value);
        used.add(key);
        used.add(value);
    }
});

const report = {
    settings: {
        rotors: rotors,
        initialPositions: positions,
        reflector: reflector,
        plugboardPairs: plugboardPairs.join(','),
        rotorWirings: rotors.map(r => currentRotors[r]).join(','),
        reflectorWiring: currentReflectors[reflector]
    },
    text: {
        input: input,
        output: output
    },
    instructions: `
ENIGMA MACHINE SETTINGS:
=======================
1. ROTORS (0-7): ${rotors.join(',')}
2. INITIAL POSITIONS (1-26): ${positions.join(',')}
3. REFLECTOR (0-4): ${reflector}
4. PLUGBOARD PAIRS: ${plugboardPairs.join(',')}
5. ROTOR WIRINGS:
${rotors.map(r => currentRotors[r]).join('\n   ')}
6. REFLECTOR WIRING:
${currentReflectors[reflector]}

VERIFICATION:
============
Input: ${input}
Output: ${output}

For decryption, enter these settings exactly as shown above.
All positions are maintained in their exact state to ensure proper decryption.`
};

const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'enigma_settings.json';
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
URL.revokeObjectURL(url);
}
