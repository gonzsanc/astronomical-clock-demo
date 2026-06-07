import './styles/base.css';
import './styles/layout.css';
import './styles/clock.css';
import './styles/clock-overlays.css';
import './styles/clock-overlay-celestial.css';
import './styles/clock-overlay-motion.css';
import './styles/clock-ceremony.css';
import './styles/clock-ceremony-motion.css';
import './styles/clock-hands.css';
import './styles/clock-hit-zones.css';
import App from './app/App.svelte';
import { mount } from 'svelte';

const target = document.getElementById('app');

if (!target) {
  throw new Error('No se encontro el contenedor principal de la demo.');
}

mount(App, { target });
