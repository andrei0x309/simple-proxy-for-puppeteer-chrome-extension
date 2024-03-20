<script lang="ts">
  import MainTab from "./main-tab.svelte";
  import PuppeteerTab from "./puppeteer-tab.svelte";
  import { getOptions, setOptions } from '@/lib/utils'
  
 

  let activeTab = 'main'
  let options: Awaited<ReturnType<typeof getOptions>>
  let theme = 'dark'
  let isDarkTheme = false

  const themeToggle = () => {
    theme = theme === 'dark' ? 'light' : 'dark'
    document.body.classList.toggle('dark')
    getOptions().then((options) => {
      options.theme = theme
      setOptions(options)
    })
  }

  const setTab = (tab: string) => {
    activeTab = tab
  }

  ;(async () => {
    options = await getOptions()
    console.log('options', options)
    theme = options.theme
    isDarkTheme = theme === 'dark'
    if (isDarkTheme) {
      document.body.classList.add('dark')
    }
  })()

</script>
 
<div class="mainbody" style="min-width: 100%">
  <input title="theme-switch" type="checkbox" id="themeSwitch" name="theme-switch" class="theme-switch__input" on:change={themeToggle} checked={isDarkTheme} />
	<label for="themeSwitch" class="theme-switch__label">
		<span></span>
	</label>
  <div class="container--tabs">
    <section class="row">
      <ul class="nav nav-tabs">
        <li class="{`${activeTab === 'main' ? 'active': ''}`}"><a on:click={() => setTab('main')}  href="#tab-1">Proxy</a></li>
        <li class="{`${activeTab === 'puppeteer' ? 'active': ''}`}"><a on:click={() => setTab('puppeteer')}  href="#tab-2">Pupeteer</a></li>
      </ul>
      <div class="tab-content">
        <MainTab isActive={activeTab === 'main'} options={options} />
        <PuppeteerTab isActive={activeTab === 'puppeteer'} />

      </div>
    </section>
  </div>
</div>

<style lang="scss">

// Toggle switch
.theme-switch__input,
.theme-switch__label {
	position: absolute;
  right: 30px;
  top: 10px;
}

.theme-switch__input {
	opacity: 0;
	
	&:hover,
	&:focus {
		+ .theme-switch__label {
			background-color: lightSlateGray;
		}
		
		+ .theme-switch__label span::after {
			background-color: lighten(lightBlue, 10%);
		}
	}
}

.theme-switch__label {
    padding: 5px;
    transition: background-color .2s ease-in-out;
    width: 40px;
    height: 15px;
    border-radius: 50px;
    text-align: center;
    background-color: #708090;
    box-shadow: -4px 4px 15px inset #0006;
	
	&::before,
	&::after {
		font-size: 1.2rem;
		position: absolute;
		transform: translate3d(0, -50%, 0);
		top: 50%;
	}
	
	&::before {
		content: '\263C';
		right: 100%;
		margin-right: 10px;
		color: orange;
	}
	
	&::after {
		content: '\263E';
		left: 100%;
		margin-left: 10px;
		color: rgb(93, 107, 121);
	}
	
	span {
		position: absolute;
		bottom: calc(100% + 10px);
		left: 0;
		width: 100%;
	}
	
	span::after {
    position: absolute;
    top: calc(100% + 12px);
    left: 2px;
    width: 12px;
    height: 12px;
    content: "";
    border-radius: 50%;
    background-color: #add8e6;
    transition: transform .2s, background-color .2s;
    box-shadow: -3px 3px 8px #0006;
	}
}

// Checked label styles
.theme-switch__input:checked ~ .theme-switch__label {
		background-color: lightSlateGray;
	
	&::before {
		color: lightSlateGray;
	}
	
	&::after {
		color: turquoise;
	}
	
	span::after {
		transform: translate3d(20px, 0, 0);
	}
}

</style>
