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
import { askNotificationPermission } from './lib/sync';
import { getInstance as getAlert } from './lib/update-alert';

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

function offerBgSync(err) {
  if (!window.navigator.onLine) {
    showBgSyncOffer();

    listen.approveBgSync((event) => {
      askNotificationPermission()
        .then(() => {
          // Todo: bg sync registration
          console.log('Do bg sync registration');
        })
        .then(showBgSyncApproval);
    });
  }

  throw err;
}

new SWManager();
