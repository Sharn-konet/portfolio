<script lang="ts">
  import {Rive, Layout, Fit, Alignment, EventType} from '@rive-app/canvas';

  let {
    src,
    autoplay = true,
    artboard,
    stateMachines,
    onRiveEvent,
  }: {
    src: string;
    autoplay?: boolean;
    artboard?: string;
    stateMachines?: string;
    onRiveEvent?: (eventName: string) => void;
  } = $props();

  let canvasEl: HTMLCanvasElement;
  let riveInstance: Rive | undefined = $state(undefined);

  $effect(() => {
    if (!canvasEl) return;
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

        // Rive event listener — will fire once .riv file has click events
        // added to each skill ball (see RIVE_IMPLEMENTATION.md).
        // Event names should follow pattern: "skill_<name>_clicked"
        if (onRiveEvent && riveInstance) {
          riveInstance.on(EventType.RiveEvent, (event: any) => {
            const eventName = event?.data?.name;
            if (eventName) {
              onRiveEvent(eventName);
            }
          });
        }
      },
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
