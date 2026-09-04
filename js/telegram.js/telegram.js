// DesiHub Telegram Mini App

let telegramUser = null;

function initTelegram() {

  // Check Telegram WebApp
  if (window.Telegram && window.Telegram.WebApp) {

    const tg = window.Telegram.WebApp;

    tg.ready();
    tg.expand();

    telegramUser = tg.initDataUnsafe?.user || null;

    console.log("Telegram WebApp initialized");

    if (telegramUser) {
      console.log("Telegram User ID:", telegramUser.id);
      console.log("Telegram Name:", telegramUser.first_name);
    }

  } else {

    console.log("Telegram WebApp नहीं मिला");

  }
}


// Get Telegram User ID
function getTelegramId() {

  if (!telegramUser) {
    return null;
  }

  return telegramUser.id;
}


// Get Telegram User
function getTelegramUser() {

  return telegramUser;
}


// Check whether app is opened inside Telegram
function isTelegramApp() {

  return !!(
    window.Telegram &&
    window.Telegram.WebApp
  );

}


// Close Telegram Mini App
function closeTelegramApp() {

  if (
    window.Telegram &&
    window.Telegram.WebApp
  ) {

    window.Telegram.WebApp.close();

  }

}


// Telegram Back Button
function setupTelegramBackButton(callback) {

  if (
    window.Telegram &&
    window.Telegram.WebApp
  ) {

    const tg = window.Telegram.WebApp;

    tg.BackButton.onClick(callback);

    tg.BackButton.show();

  }

}


// Hide Telegram Back Button
function hideTelegramBackButton() {

  if (
    window.Telegram &&
    window.Telegram.WebApp
  ) {

    window.Telegram.WebApp.BackButton.hide();

  }

}


// Initialize
initTelegram();


// Make functions available
window.getTelegramId = getTelegramId;
window.getTelegramUser = getTelegramUser;
window.isTelegramApp = isTelegramApp;
window.closeTelegramApp = closeTelegramApp;
window.setupTelegramBackButton = setupTelegramBackButton;
window.hideTelegramBackButton = hideTelegramBackButton;
