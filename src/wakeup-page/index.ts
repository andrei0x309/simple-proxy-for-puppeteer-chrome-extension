import '../action-page/index.scss';
import Main from '@/pages/wakeup-page.svelte';

const target = document.getElementById('app');

function render() {
  if (target) {
    new Main({ target });
  }
}

document.addEventListener('DOMContentLoaded', render);
