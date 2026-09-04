const USER_KEY = "desihub_users";
const CURRENT_USER_KEY = "desihub_current_user";
const VIDEO_KEY = "desihub_videos";

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

function show(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "";
}

function hide(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "none";
}

function showMainApp() {
  hide("authScreen");
  show("mainApp");

  const user = getCurrentUser();

  document.querySelectorAll(".userName").forEach(el => {
    el.textContent = user?.name || "User";
  });

  document.querySelectorAll(".userEmail").forEach(el => {
    el.textContent = user?.email || "";
  });

  loadVideos();
}

function showAuth() {
  show("authScreen");
  hide("mainApp");
}

function signup() {
  const name = document.getElementById("signupName")?.value.trim();
  const email = document.getElementById("signupEmail")?.value.trim().toLowerCase();
  const password = document.getElementById("signupPassword")?.value;

  if (!name || !email || !password) {
    alert("सभी जानकारी भरें।");
    return;
  }

  if (password.length < 4) {
    alert("Password कम से कम 4 characters का रखें।");
    return;
  }

  const users = getUsers();

  if (users.some(user => user.email === email)) {
    alert("यह email पहले से registered है।");
    return;
  }

  const user = {
    id: Date.now(),
    name,
    email,
    password,
    premium: false
  };

  users.push(user);
  saveUsers(users);
  saveCurrentUser(user);

  alert("🎉 Account बन गया!");

  showMainApp();
}

function login() {
  const email = document.getElementById("loginEmail")?.value.trim().toLowerCase();
  const password = document.getElementById("loginPassword")?.value;

  if (!email || !password) {
    alert("Email और Password डालें।");
    return;
  }

  const users = getUsers();

  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    alert("❌ Email या Password गलत है।");
    return;
  }

  saveCurrentUser(user);
  showMainApp();
}

function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
  showAuth();
}

function loadVideos() {
  const grid = document.getElementById("videoGrid");
  if (!grid) return;

  const videos = getVideos();

  if (videos.length === 0) {
    grid.innerHTML = `
      <div style="padding:20px;text-align:center">
        अभी कोई video उपलब्ध नहीं है।
      </div>
    `;
    return;
  }

  grid.innerHTML = videos.map((video, index) => `
    <div class="video-card" onclick="playVideo(${index})">
      <img
        src="${escapeHTML(video.thumbnail || 'https://via.placeholder.com/600x340?text=DesiHub')}"
        alt="${escapeHTML(video.title)}"
        style="width:100%;border-radius:10px"
      >

      <h3>${escapeHTML(video.title)}</h3>

      <p>
        ${escapeHTML(video.category || "")}
        ${video.duration ? " • " + escapeHTML(video.duration) : ""}
      </p>
    </div>
  `).join("");
}

function playVideo(index) {
  const videos = getVideos();
  const video = videos[index];

  if (!video) return;

  const player = document.getElementById("videoPlayer");
  const title = document.getElementById("playerTitle");
  const modal = document.getElementById("playerModal");

  if (player) player.src = video.url;
  if (title) title.textContent = video.title;
  if (modal) modal.style.display = "flex";
}

function closePlayer() {
  const modal = document.getElementById("playerModal");
  const player = document.getElementById("videoPlayer");

  if (player) {
    player.pause();
    player.src = "";
  }

  if (modal) modal.style.display = "none";
}

function escapeHTML(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

document.addEventListener("DOMContentLoaded", function() {

  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
      e.preventDefault();
      login();
    });
  }

  const signupForm = document.getElementById("signupForm");

  if (signupForm) {
    signupForm.addEventListener("submit", function(e) {
      e.preventDefault();
      signup();
    });
  }

  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }

  const currentUser = getCurrentUser();

  if (currentUser) {
    showMainApp();
  } else {
    showAuth();
  }
});
