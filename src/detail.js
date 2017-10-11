import { mount } from './lib/dom';
import * as listen from './lib/events';
import SWManager from './lib/sw-manager';
import { getRecipe } from './lib/request';
import { getRecipeId } from './lib/utils';
import { getInstance as getAlert } from './lib/update-alert';
import { buildRecipeDetailHTML, buildBackgroundSyncOfferHTML } from './lib/templates';

const recipeId = getRecipeId();
const mountIntoDOM = html => mount('#recipe-detail', html);

getRecipe(recipeId)
  .catch(offerBgSync)
  .then(buildRecipeDetailHTML)
  .then(mountIntoDOM)
  .then(listen.submitComment)
  .then(getAlert);

const showBgSyncOffer = () => mountIntoDOM(buildBackgroundSyncOfferHTML());

function offerBgSync(err) {
  if (!window.navigator.onLine) {
    showBgSyncOffer();
  }

  throw err;
}

new SWManager();
