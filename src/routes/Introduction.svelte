<script lang='ts'>
    export let isDark: boolean;

    let nightPicture = '/DSC02179-cropped-to-match.jpg'
    let dayPicture = '/DSC02436-cropped-to-match.jpg'

    let picture: string = dayPicture;

    $: if (isDark) {
        let picture = nightPicture;
    } else {
        let picture = dayPicture
    }

</script>

<div style="background-image: linear-gradient(rgba(0,0,0,0.5), rgb(0,0,0,0.5)), url('{picture}')">
    <h2>Hi, I'm Sharn</h2>
</div>

<style>

    div {
        height: 50%;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        position: relative;
    }

    h2 {
        position: absolute;
        text-align: center;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        text-size: 4em;
    }
</style>

