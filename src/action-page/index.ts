import './index.scss';
import Main from '@/pages/main.svelte';

const target = document.getElementById('app');

function render() {
  if (target) {
    new Main({ target });
  }
}

document.addEventListener('DOMContentLoaded', render);
