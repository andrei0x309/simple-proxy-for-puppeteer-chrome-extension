<script lang="ts">
    import { onMount } from 'svelte';
    export let alertMsg = '';
    export let alertType = 'warning' as 'warning' | 'success' | 'danger' | 'info';
    export let alertVisible = false;
    export let alertTimeout = 5000;

    const type = {
        warning: 'alert-warning',
        success: 'alert-success',
        danger: 'alert-danger',
        info: 'alert-info'
    }

    onMount(() => {
        setTimeout(() => {
            alertVisible = false;
        }, alertTimeout);
    });

    const closeAlert = () => {
        alertVisible = false;
    }

    export const showAlert = (msg: string, type: 'warning' | 'success' | 'danger' | 'info') => {
        alertMsg = msg;
        alertType = type;
        alertVisible = true;
    }

</script>



<div id="exAlert" class="{`${alertVisible ? '' : 'hidden'}`}">
    <hr />
    <div id="exAlertBox" class="{`alert ${type[alertType]}`}">
      <button on:click={
        () => {
          closeAlert();
        }
      } id="closeAlertBtn" type="button" class="close-alert"><i class="icss-x"></i></button>
      <i class="icss-exclamation-circle"></i>&nbsp;
      <span style="line-height: 2em; display: inline-table" id="alertMsg">{alertMsg}</span>
    </div>
    <hr />
  </div>