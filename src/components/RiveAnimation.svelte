<script lang="ts">
  import {Rive, Layout, Fit, Alignment} from '@rive-app/canvas';
	import {onMount} from 'svelte';

  export let src;
  export let autoplay;
  export let artboard;
  export let stateMachines;
  export let riveInstance;

	onMount(() => {
		const canvasEl = document.getElementById('rive-canvas');
		riveInstance = new Rive({
			src,
			autoplay,
			artboard,
			layout: new Layout({
				fit: Fit.None,
				alignment: Alignment.Center,
			}),
			stateMachines,
			canvas: canvasEl,
			onLoad: () => {
				riveInstance.resizeDrawingSurfaceToCanvas();
			},
		});
	});
</script>

<div class="rive-canvas-container">
  <canvas id="rive-canvas"></canvas>
</div>

<style>
  .rive-canvas-container {
		width: 100%;
		height: 100%;
    overflow:hidden;
	}

	#rive-canvas {
		width: max(100%, 750px);
		height: 100%;
    margin: -10% 0 -15% 0;
    mask: linear-gradient(90deg, transparent, white 20%, white 80%, transparent);
    -webkit-mask: linear-gradient(90deg, transparent, white 20%, white 80%, transparent);
	}
</style>
