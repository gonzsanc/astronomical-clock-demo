<script lang="ts">
  import type { MotionPreference, SoundState } from '../domain/types';

  export let soundState: SoundState;
  export let motionPreference: MotionPreference;
  export let finalState = false;
  export let onHelp: () => void;
  export let onSound: () => void;
  export let onMotion: () => void;
  export let onReset: () => void;
</script>

<nav class="control-dock" aria-label="Controles secundarios">
  <button type="button" aria-label="Abrir ayuda" title="Ayuda" onclick={onHelp}>Ayuda</button>
  <button
    type="button"
    aria-label="Alternar sonido"
    aria-pressed={soundState === 'enabled'}
    title="Sonido"
    onclick={onSound}
  >
    {soundState === 'enabled' ? 'Sonido activo' : 'Silencio'}
  </button>
  <button
    type="button"
    aria-label="Alternar movimiento reducido"
    aria-pressed={motionPreference === 'reduced'}
    title="Movimiento"
    onclick={onMotion}
  >
    {motionPreference === 'reduced' ? 'Movimiento reducido' : 'Movimiento completo'}
  </button>
  <button class:featured={finalState} type="button" aria-label="Reiniciar mecanismo" onclick={onReset}>
    Reiniciar
  </button>
</nav>
