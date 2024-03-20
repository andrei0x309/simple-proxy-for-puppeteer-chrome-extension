<script lang="ts">
    export let isActive = false;

    const navigdateTo = (url: string) => {
        chrome.tabs.create({ url });
    }

</script>


<div id="tab-2" class="{`tab-pane ${isActive ? 'active' : ''}`}" style="font-size: 0.9rem; text-align: left">
    <br /><br />
    This extension can be used with Puppeteer to control the proxy setting of the web browser.
    <br /><br />
    But you can use it as a simple proxy extension without Puppeteer. The only requirement is a working proxy server.
    <br /><br />
    If you want  to use it with Puppeteer you can see an example on github here 
    <a on:click={() => {
        navigdateTo('https://github.com/andrei0x309/simple-proxy-for-puppeteer-chrome-extension/tree/main/example')
    }} href="#link1">Example Link</a>
    <br /><br />
    Was first created on Jul 28, 2021 and fully rewritten on Mar 20, 2024 to use Svelte, Manifest V3 and TypeScript,
    and service woker instead of background page.
    <br /><br />
    Is open source and can be found on github here <a on:click={() => {
        navigdateTo('https://github.com/andrei0x309/simple-proxy-for-puppeteer-chrome-extension')
    }} href="#link1">Repo Link</a>

  </div>