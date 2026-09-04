const USER_KEY = "desihub_users";
const CURRENT_USER_KEY = "desihub_current_user";
const VIDEO_KEY = "desihub_videos";

const demoVideos = [
  {
    id: "demo1",
    title: "DesiHub Demo Video",
    category: "drama",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800",
    duration: "00:10",
    description: "DesiHub demo video"
  },
  {
    id: "demo2",
    title: "Comedy Demo",
    category: "comedy",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=800",
    duration: "00:20",
    description: "Comedy demo video"
  }
];

document.addEventListener("DOMContentLoaded", () => {
  initUserPanel();
});

function initUserPanel() {
  createDemoVideos();
  setupAuth();
  setupNavigation();
  setupSearch();
  setupModals();
  loadCurrentUser();
  loadVideos();
}

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY)) || [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USER_KEY, JSON.stringify(users));
}

function getVideos() {
  try {
    return JSON.parse(localStorage.getItem(VIDEO_KEY)) || [];
  } catch {
    return [];
  }
}

function saveVideos(videos) {
  localStorage.setItem(VIDEO_KEY, JSON.stringify(videos));
}

function createDemoVideos() {
  if (!localStorage.getItem(VIDEO_KEY)) {
    saveVideos(demoVideos);
  }
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
  } catch {
    return null;
  }
}

function saveCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
  showToast("Logout हो गया");
  setTimeout(() => location.reload(), 500);
}

function setupAuth() {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
      e.preventDefault();

      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;

      const users = getUsers();

      const user = users.find(
        u => u.email === email && u.password === password
      );

      if (!user) {
        showToast("Email या password गलत है");
        return;
      }

      saveCurrentUser(user);
      showToast("Login सफल हुआ");

      setTimeout(() => {
        location.reload();
      }, 500);
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", function(e) {
      e.preventDefault();

      const name = document.getElementById("signupName").value.trim();
      const email = document.getElementById("signupEmail").value.trim();
      const password = document.getElementById("signupPassword").value;

      const users = getUsers();

      if (users.some(u => u.email === email)) {
        showToast("यह email पहले से मौजूद है");
        return;
      }

      const user = {
        id: Date.now().toString(),
        name,
        email,
        password,
        subscription: "free",
        expiry: null,
        createdAt: new Date().toISOString()
      };

      users.push(user);
      saveUsers(users);
      saveCurrentUser(user);

      showToast("Account बन गया");

      setTimeout(() => {
        location.reload();
      }, 500);
    });
  }

  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }
}

function loadCurrentUser() {
  const user = getCurrentUser();

  const authScreen = document.getElementById("authScreen");
  const mainApp = document.getElementById("mainApp");

  if (!user) {
    if (authScreen) authScreen.classList.remove("hidden");
    if (mainApp) mainApp.classList.add("hidden");
    return;
  }

  if (authScreen) authScreen.classList.add("hidden");
  if (mainApp) mainApp.classList.remove("hidden");

  const nameElements = document.querySelectorAll(".userName");

  nameElements.forEach(el => {
    el.textContent = user.name || "User";
  });

  const emailElements = document.querySelectorAll(".userEmail");

  emailElements.forEach(el => {
    el.textContent = user.email || "";
  });

  updateSubscription();
}

function updateSubscription() {
  const user = getCurrentUser();

  if (!user) return;

  let active = false;

  if (user.subscription && user.expiry) {
    active = new Date(user.expiry).getTime() > Date.now();
  }

  const premiumElements = document.querySelectorAll(".premiumStatus");

  premiumElements.forEach(el => {
    el.textContent = active ? "Premium Active" : "Free Plan";
  });

  const subscriptionBanner =
    document.getElementById("subscriptionBanner");

  if (subscriptionBanner) {
    subscriptionBanner.style.display = active ? "none" : "block";
  }
}

function hasPremium() {
  const user = getCurrentUser();

  if (!user) return false;

  return (
    user.subscription &&
    user.expiry &&
    new Date(user.expiry).getTime() > Date.now()
  );
}

function loadVideos(list = getVideos()) {
  const grid = document.getElementById("videoGrid");

  if (!grid) return;

  if (!list.length) {
    grid.innerHTML = "<p>कोई video नहीं मिला।</p>";
    return;
  }

  grid.innerHTML = list.map(video => `
    <div class="video-card" onclick="playVideo('${escapeHTML(video.id)}')">

      <div class="video-thumb">
        <img
          src="${escapeHTML(video.thumbnailUrl)}"
          alt="${escapeHTML(video.title)}"
          onerror="this.src='https://via.placeholder.com/600x350?text=DesiHub'"
        >

        <span class="video-duration">
          ${escapeHTML(video.duration || "")}
        </span>
      </div>

      <div class="video-info">
        <h3>${escapeHTML(video.title)}</h3>
        <p>${escapeHTML(video.description || "")}</p>
      </div>

    </div>
  `).join("");
}

function setupNavigation() {
  document.querySelectorAll("[data-category]").forEach(button => {
    button.addEventListener("click", () => {
      const category = button.dataset.category;
      filterByCategory(category);
    });
  });
}

function filterByCategory(category) {
  const buttons = document.querySelectorAll("[data-category]");

  buttons.forEach(btn => {
    btn.classList.toggle(
      "active",
      btn.dataset.category === category
    );
  });

  if (category === "all") {
    loadVideos();
    return;
  }

  const videos = getVideos().filter(
    video => video.category === category
  );

  loadVideos(videos);
}

function setupSearch() {
  const searchInput = document.getElementById("searchInput");

  if (!searchInput) return;

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();

    const videos = getVideos().filter(video =>
      video.title.toLowerCase().includes(query) ||
      video.description.toLowerCase().includes(query)
    );

    loadVideos(videos);
  });
}

function playVideo(id) {
  const video = getVideos().find(v => v.id === id);

  if (!video) {
    showToast("Video नहीं मिला");
    return;
  }

  if (!hasPremium()) {
    showToast("Video देखने के लिए Premium चाहिए");

    const paymentModal =
      document.getElementById("paymentModal");

    if (paymentModal) {
      paymentModal.classList.remove("hidden");
    }

    return;
  }

  const playerModal =
    document.getElementById("playerModal");

  const player =
    document.getElementById("videoPlayer");

  const title =
    document.getElementById("playerTitle");

  if (player) {
    player.src = video.videoUrl;
    player.load();
  }

  if (title) {
    title.textContent = video.title;
  }

  if (playerModal) {
    playerModal.classList.remove("hidden");
  }
}

function setupModals() {
  document.querySelectorAll("[data-close-modal]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.closeModal;
      const modal = document.getElementById(id);

      if (modal) modal.classList.add("hidden");
    });
  });

  document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", e => {
      if (e.target === modal) {
        modal.classList.add("hidden");
      }
    });
  });

  document.querySelectorAll("[data-plan]").forEach(btn => {
    btn.addEventListener("click", () => {
      const plan = btn.dataset.plan;
      processPayment(plan);
    });
  });
}

function processPayment(plan) {
  const plans = {
    monthly: {
      price: 99,
      days: 30
    },
    quarterly: {
      price: 249,
      days: 90
    },
    yearly: {
      price: 799,
      days: 365
    }
  };

  const selected = plans[plan];

  if (!selected) {
    showToast("Plan नहीं मिला");
    return;
  }

  const user = getCurrentUser();

  if (!user) {
    showToast("पहले login करें");
    return;
  }

  /*
    यह अभी DEMO PAYMENT है।
    असली Razorpay/payment gateway लगाने के लिए
    secure backend की जरूरत होगी।
  */

  const expiry = new Date();

  expiry.setDate(
    expiry.getDate() + selected.days
  );

  user.subscription = plan;
  user.expiry = expiry.toISOString();

  saveCurrentUser(user);

  const users = getUsers();

  const index = users.findIndex(
    u => u.id === user.id
  );

  if (index !== -1) {
    users[index] = user;
    saveUsers(users);
  }

  showToast(
    `Demo payment सफल — ₹${selected.price}`
  );

  const modal =
    document.getElementById("paymentModal");

  if (modal) {
    modal.classList.add("hidden");
  }

  updateSubscription();
}

function showToast(message) {
  const toast = document.getElementById("toast");

  if (!toast) return;

  toast.textContent = message;
  toast.style.display = "block";

  clearTimeout(window.toastTimer);

  window.toastTimer = setTimeout(() => {
    toast.style.display = "none";
  }, 2500);
}

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

window.playVideo = playVideo;
window.filterByCategory = filterByCategory;
window.showToast = showToast;
window.logout = logout;
