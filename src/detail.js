import {
  buildRecipeDetailHTML,
  buildBgSyncApprovalHTML,
  buildBackgroundSyncOfferHTML,
} from './lib/templates';
import { mount } from './lib/dom';
import * as listen from './lib/events';
import SWManager from './lib/sw-manager';
import { getRecipe } from './lib/request';
import { getRecipeId } from './lib/utils';
import { getInstance as getAlert } from './lib/update-alert';
import { queue, askNotificationPermission } from './lib/sync';

const recipeId = getRecipeId();
const mountIntoDOM = html => mount('#recipe-detail', html);

getRecipe(recipeId)
  .catch(offerBgSync)
  .then(buildRecipeDetailHTML)
  .then(mountIntoDOM)
  .then(listen.submitComment)
  .then(getAlert);

const showBgSyncOffer = () => mountIntoDOM(buildBackgroundSyncOfferHTML());
const showBgSyncApproval = () => mountIntoDOM(buildBgSyncApprovalHTML());
const getServiceWorkerRegistration = () => navigator.serviceWorker.ready;
const registerBgSync = reg => reg.sync.register('load-recipe');
const queueRecipeLoad = () => queue('load-recipe-queue', { recipeId });

function offerBgSync(err) {
  if (!window.navigator.onLine) {
    showBgSyncOffer();

    listen.approveBgSync((event) => {
      askNotificationPermission()
        .then(queueRecipeLoad)
        .then(getServiceWorkerRegistration)
        .then(registerBgSync)
        .then(showBgSyncApproval);
    });
  }

  throw err;
}

new SWManager();
