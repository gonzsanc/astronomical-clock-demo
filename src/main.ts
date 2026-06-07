import './styles/base.css';
import './styles/layout.css';
import './styles/clock.css';
import App from './app/App.svelte';
import { mount } from 'svelte';

const target = document.getElementById('app');

if (!target) {
  throw new Error('No se encontro el contenedor principal de la demo.');
}

mount(App, { target });
