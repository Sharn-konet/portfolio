<script lang="ts">
	import EntryList from '$lib/components/EntryList.svelte';
	import RevealText from '$lib/components/RevealText.svelte';

	let { data } = $props();
</script>

<RevealText>
	<EntryList items={data.experience} label="// Experience" />
	<EntryList items={data.projects} label="// Projects" />
</RevealText>
