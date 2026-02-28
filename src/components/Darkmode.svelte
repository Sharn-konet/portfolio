<script lang='ts'>
    let isDark = $state(false);
    let mounted = $state(false);

    $effect(() => {
        if (!mounted) {
            isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            mounted = true;
        }
    });

    $effect(() => {
        if (!mounted) return;
        if (isDark) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    });

    function toggle() {
        isDark = !isDark;
    }
</script>

<button class="toggle" onclick={toggle} aria-label="Toggle dark mode">
    <div class="track" class:dark={isDark}>
        <div class="thumb" class:dark={isDark}></div>
    </div>
</button>

<style>
    .toggle {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        display: flex;
        align-items: center;
    }

    .track {
        width: 44px;
        height: 24px;
        border-radius: 12px;
        background-color: rgba(var(--light-mode-text-color), 0.3);
        position: relative;
        transition: background-color 0.3s;
    }

    .track.dark {
        background-color: rgba(var(--light-mode-text-color), 0.6);
    }

    .thumb {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: white;
        position: absolute;
        top: 2px;
        left: 2px;
        transition: transform 0.3s;
    }

    .thumb.dark {
        transform: translateX(20px);
    }
</style>
