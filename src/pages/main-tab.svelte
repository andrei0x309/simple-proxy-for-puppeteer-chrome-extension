
<script lang="ts">
    import { onMount } from 'svelte';
    import { setOptions, getProxyIp } from '@/lib/utils'
    import Alert from '@/components/alert.svelte'

    export let isActive = false;
    export let options: any
    let isProxyEnabled = false;
    let isVerifyingProxy = false;
    let port = ''
    let host = ''
    let proxyType = 'http'
    let alert: any & { showAlert: (msg: string, type: 'warning' | 'success' | 'danger' | 'info') => void };

    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            console.log('onMessage', request);
            if (request.msg === "proxyError") {
                alert?.showAlert(request?.message || 'Error setting proxy', 'warning');
                isProxyEnabled = false;
            }
        }
    );


    const setProxy = () => {
        isProxyEnabled = true;
        // console.log(await getStorageData('options'));

        const request = {
            action: 'setProxy',
            data: {
                proxy: {
                    host,
                    port,
                    type: proxyType
                }
            }
        }


        chrome.runtime.sendMessage(request, (response) => {
            if (response.error) {
                isProxyEnabled = false;
                alert?.showAlert(response?.message || 'Error setting proxy', 'warning');
            }
        });
    };


    const verifyProxy = async () => {
        isVerifyingProxy = true;
        try {
        const config = {
            mode: 'fixed_servers',
            rules: {
                singleProxy: {
                    scheme: proxyType,
                    host: host,
                    port: parseInt(port)
                },
                bypassList: ['localhost']
            }
        }
        await chrome.proxy.settings.set({value: config, scope: 'regular'});
        const data = await getProxyIp()
        if(!data.error) {
            isVerifyingProxy = false;
            alert?.showAlert('Proxy verified successfully IP:' + data?.ip, 'success');
            return;
        } else {
            isVerifyingProxy = false;
            alert?.showAlert('Proxy failed to get data please try a diffrent one', 'warning');
        }
        } catch (error) {
            console.log('error', error);
        }
        isVerifyingProxy = false;
        alert?.showAlert('Proxy failed to get data please try a diffrent one', 'warning');
    };
    
    const disableProxy = () => {
        isProxyEnabled = false;
        const request = {
            action: 'disableProxy'
        }
        chrome.runtime.sendMessage(request, (response) => {
            if (response.error) {
                isProxyEnabled = true;
                alert?.showAlert(response?.message || 'Error disabling proxy', 'warning');
            }
        });
    };

    const setProxyType = (type: string) => {
        if (!isProxyEnabled) {
            proxyType = type;
        }
    }

    const setCheck = async (name: string) => {
        if (isVerifyingProxy) return;
        isVerifyingProxy = true;
        try {
        if (!isProxyEnabled) {
            options[name] = !options[name];
            setOptions(options);
        }
        } catch (error) {
            console.warn('error', error);
        }
        isVerifyingProxy = false;
    }

    $: {
        console.log('options', options)
        port = options?.activeProxy?.port || '';
        host = options?.activeProxy?.host || '';
        proxyType = options?.activeProxy?.type || 'http';
        isProxyEnabled = options?.proxyEnabled || false;
    }
   

</script>


<div id="tab-1" class="{`tab-pane ${isActive ? 'active' : ''} ${ isVerifyingProxy ? 'blink' : ''}`}">
    <h3>Proxy Type:</h3>
    <div id="proxyTypeGroup" style="{ isProxyEnabled ? 'pointer-events: none; opacity: 0.5; cursor: not-allowed;' : '' }">
      <button on:click={ () => { setProxyType('http') }} class="{`btn btn-default ${proxyType === 'http'? 'btn-green': ''}`}" id="btnProxyTypeHttp">HTTP</button>
      <button on:click={ () => { setProxyType('https') }} class="{`btn btn-default ${proxyType === 'https'? 'btn-green': ''}`}" id="btnProxyTypeHttps">HTTPS</button>
      <button on:click={ () => { setProxyType('socks4') }} class="{`btn btn-default ${proxyType === 'socks4'? 'btn-green': ''}`}" id="btnProxyTypeSocks4">SOCKS4</button>
      <button on:click={ () => { setProxyType('socks5') }} class="{`btn btn-default ${proxyType === 'socks5'? 'btn-green': ''}`}" id="btnProxyTypeSocks5">SOCKS5</button>
    </div>

    <h3>Proxy Host/IP:</h3>

    <div class="host">
      <input bind:value={host} id="proxyHost" type="text" disabled={isProxyEnabled} class={isProxyEnabled ? 'gray-out' : ''} />
    </div>

    <h3>Proxy Port:</h3>

    <div class="port">
      <input bind:value={port} id="proxyPort" type="number" disabled={isProxyEnabled} class={isProxyEnabled ? 'gray-out' : ''} />
    </div>

    <div class="switch switch--4 text-[0.8rem] flex flex-col mb-4">
      <span class="inline-block lab-span">Disconnect on failure</span>
        <label class="switch__label mt-2">
          <input on:click={() => setCheck('proxyDisconnectOnFailure')} type="checkbox" class="switch__input"
          checked={!!options?.proxyDisconnectOnFailure}
          id="proxyDisconnectOnFailure"
          >
          <span class="switch__design"></span>
        </label>
    </div>

    <div class="switch switch--4 text-[0.8rem] flex flex-col mb-4">
      <span class="inline-block lab-span">Enable on browser start</span>
        <label class="switch__label mt-2">
          <input on:click={() => setCheck('proxyEnableOnBrowserStart')} type="checkbox" class="switch__input"
          checked={!!options?.proxyEnableOnBrowserStart}
          id="proxyEnableOnBrowserStart"
          >
          <span class="switch__design"></span>
        </label>
    </div>

    <Alert bind:this={alert} alertMsg="" alertType="warning" alertVisible={false} alertTimeout={0} />
    <p style="font-size: 1.15rem">
      Proxy status:
      {#if isProxyEnabled}
      <span id="spanProxyStatusOn" style="color: #3d8b3d">enabled</span>
      {:else }
      <span id="spanProxyStatusOff" style="color: #8f2a1f">disabled</span>
      {/if}
    </p>

    {#if !isProxyEnabled}
    <button on:click={
        () => {
            verifyProxy();
        }
    } class="btn btn-green" style="margin-bottom: 1rem;" id="btnProxyStart">Verify Proxy</button>
    {/if}

    {#if !isProxyEnabled}
    <button on:click={
        () => {
            setProxy();
        }
    } class="btn btn-green" id="btnProxyStart">Enable Proxy</button>
    {:else }
    <button class="btn btn-rouge" id="btnProxyStop"
    on:click={
        () => {
            disableProxy();
        }
    }
    >Disable Proxy</button>
    {/if}
  </div>

  <style lang="scss">

  .gray-out {
    pointer-events: none;
    opacity: 0.5;
  }

//   .switches-settings {



// & {
//   display: flex;
//   align-items: center;

//   margin-top: 0.8rem;
// }

// }

// switch
// ==========================================================



.switch {

--primary-light: hsl(160, 79%, 46%);
--primary-dark: hsl(160, 79%, 16%);
--ripple: hsla(160, 79%, 46%, .1);
--focus: hsl(160, 69%, 46%);

margin: 14px;

&__label {
  position: relative;
  cursor: pointer;
}

&__input {
  opacity: 0;

  position: absolute;
  top: 50%;
  left: 50%;
  z-index: -1;
  transform: translate(-50%, -50%);
}

&__input:focus+&__design {
  box-shadow: 0 0 0 .1rem var(--global-background), 0 0 0 .2rem var(--focus);
}

// variables
// ----------------------------------------------------
& {
  --width: 2.6rem;
  --height: 1.4rem;

  --background: hsl(0, 0%, 30%);
  --checked-background: var(--primary-dark);

  --thumb-size: 0.9rem;
  --thumb-ripple-color: var(--ripple);
  --thumb-background: hsl(0, 0%, 65%);
  --checked-thumb-background: var(--primary-light);
  --thumb-space-between-edges: 2px;
  --thumb-out: var(--thumb-space-between-edges);
}


&--4 {
  --border: 1px solid hsl(0, 0%, 60%);
  --background: transparent;
}

span.lab-span {
  position: relative;
  top: -6px;
  left: -6px;
}

// appearance
// ----------------------------------------------------
&__design {
  display: inline-block;

  width: var(--width);
  height: var(--height);
  border: var(--border);

  background: var(--background);
  position: relative;

  transition: .2s, box-shadow 0s;
}

&__design::before {
  content: '';

  position: absolute;
  left: var(--thumb-out);
  top: 50%;
  transform: translateY(-50%);

  width: var(--thumb-size);
  height: var(--thumb-size);

  background: var(--thumb-background);

  transition: inherit;
}


// states
// ----------------------------------------------------
&__input:checked+&__design {
  border-color: transparent;
  background: var(--checked-background);
}

&__input:checked+&__design::before {
  left: calc(100% - (var(--thumb-size) + var(--thumb-out)));
  background: var(--checked-thumb-background);
}


}

.blink {
    animation: blinker 1s linear infinite;
    cursor: wait;
}

@keyframes blinker {
    50% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}


  </style>