<script lang="ts">
  let {
    src,
    autoplay = true,
    artboard,
    stateMachines,
  }: {
    src: string;
    autoplay?: boolean;
    artboard?: string;
    stateMachines?: string;
  } = $props();

  let canvasEl: HTMLCanvasElement;
  let riveInstance: any = $state(undefined);

  $effect(() => {
    if (!canvasEl) return;

    // Dynamic import to handle CJS/ESM module resolution
    import('@rive-app/canvas').then((module) => {
      const rive = module.default || module;
      const { Rive, Layout, Fit, Alignment } = rive;

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
          riveInstance?.resizeDrawingSurfaceToCanvas();
        },
      });
    });

    return () => {
      riveInstance?.cleanup();
    };
  });
</script>

<div class="rive-canvas-container">
  <canvas bind:this={canvasEl}></canvas>
</div>

<style>
  .rive-canvas-container {
		width: 100%;
		height: 100%;
    overflow:hidden;
    mask: linear-gradient(90deg, transparent, white 20%, white 80%, transparent);
    -webkit-mask: linear-gradient(90deg, transparent, white 20%, white 80%, transparent);
	}

	canvas {
		width: max(100%, 750px);
		height: 100%;
    margin: -10% 0 -15% 0;
	}
</style>
