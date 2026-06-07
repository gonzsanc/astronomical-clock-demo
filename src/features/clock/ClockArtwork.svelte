<script lang="ts">
  const clockAsset = '/assets/clock/reloj_astronomico_base.webp';
  let assetFailed = false;
</script>

<div class="clock-artwork" aria-live="off">
  {#if assetFailed}
    <div class="clock-artwork-fallback" aria-hidden="true"></div>
  {:else}
    <img
      src={clockAsset}
      alt="Reloj astronomico frontal con zodiaco, esfera celeste, luna y medallones estacionales"
      width="1254"
      height="1254"
      decoding="async"
      fetchpriority="high"
      onerror={() => (assetFailed = true)}
    />
  {/if}
</div>
