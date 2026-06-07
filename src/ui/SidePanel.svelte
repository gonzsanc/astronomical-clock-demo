<script lang="ts">
  export let open = false;
  export let title = '';
  export let text = '';
  export let onClose: () => void;
</script>

<aside class:open class="side-panel" aria-hidden={!open} data-testid="side-panel">
  <button class="panel-close" type="button" aria-label="Cerrar panel" onclick={onClose}>×</button>
  <p class="panel-kicker">Modo activo</p>
  <h2>{title}</h2>
  <p>{text}</p>
</aside>
