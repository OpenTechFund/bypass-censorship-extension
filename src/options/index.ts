import { options } from '../utils/options';

async function loadOptions() {
  options.syncForm('#options');
}

document.addEventListener("DOMContentLoaded", loadOptions);
