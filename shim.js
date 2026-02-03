// URL polyfill - must be first
import 'react-native-url-polyfill/auto';

// Buffer polyfill
import { Buffer } from 'buffer';
global.Buffer = Buffer;

// Process polyfill  
import process from 'process';
global.process = process;

// Path polyfills
if (typeof __dirname === 'undefined') global.__dirname = '/';
if (typeof __filename === 'undefined') global.__filename = '';