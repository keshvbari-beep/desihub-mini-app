const VIDEO_KEY = "desihub_videos";
const USER_KEY = "desihub_users";

document.addEventListener("DOMContentLoaded", () => {
  initAdmin();
});

function initAdmin() {
  setupNavigation();
  setupVideoForm();
  loadDashboard();
  loadVideos();
  loadUsers();
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

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY)) || [];
  } catch {
    return [];
  }
}

/* Navigation */

function setupNavigation() {
  document.querySelectorAll(".admin-nav[data-section]").forEach(btn => {
    btn.addEventListener("click", () => {
      showSection(btn.dataset.section);

      document.querySelectorAll(".admin-nav[data-section]").forEach(b => {
        b.classList.remove("active");
      });

      btn.classList.add("active");
    });
  });
}

function showSection(section) {
  const sections = {
    dashboard: document.getElementById("dashboardSection"),
    videos: document.getElementById("videosSection"),
    users: document.getElementById("usersSection")
  };

  Object.values(sections).forEach(el => {
    if (el) el.classList.add("hidden");
  });

  if (sections[section]) {
    sections[section].classList.remove("hidden");
  }

  if (section === "dashboard") {
    loadDashboard();
  }

  if (section === "videos") {
    loadVideos();
  }

  if (section === "users") {
    loadUsers();
  }
}

/* Dashboard */

function loadDashboard() {
  const videos = getVideos();
  const users = getUsers();

  const totalVideos = document.getElementById("totalVideos");
  const totalUsers = document.getElementById("totalUsers");
  const activePremium = document.getElementById("activePremium");

  if (totalVideos) {
    totalVideos.textContent = videos.length;
  }

  if (totalUsers) {
    totalUsers.textContent = users.length;
  }

  if (activePremium) {
    const premiumCount = users.filter(user => {
      if (!user.expiry) return false;

      return new Date(user.expiry).getTime() > Date.now();
    }).length;

    activePremium.textContent = premiumCount;
  }
}

/* Add Video */

function setupVideoForm() {
  const form = document.getElementById("videoForm");

  if (!form) return;

  form.addEventListener("submit", event => {
    event.preventDefault();

    const title = document.getElementById("videoTitle").value.trim();
    const category = document.getElementById("videoCategory").value;
    const videoUrl = document.getElementById("videoUrl").value.trim();
    const thumbnailUrl = document.getElementById("thumbnailUrl").value.trim();
    const duration = document.getElementById("videoDuration").value.trim();
    const description = document.getElementById("videoDescription").value.trim();

    if (!title || !category || !videoUrl || !thumbnailUrl) {
      showToast("सभी जरूरी जानकारी भरें");
      return;
    }

    const videos = getVideos();

    const newVideo = {
      id: Date.now().toString(),
      title,
      category,
      videoUrl,
      thumbnailUrl,
      duration,
      description,
      createdAt: new Date().toISOString()
    };

    videos.unshift(newVideo);

    saveVideos(videos);

    form.reset();

    loadVideos();
    loadDashboard();

    showToast("Video successfully add हो गया");
  });
}

/* Video List */

function loadVideos() {
  const container = document.getElementById("videoList");

  if (!container) return;

  const videos = getVideos();

  if (!videos.length) {
    container.innerHTML = "<p>अभी कोई video नहीं है।</p>";
    return;
  }

  container.innerHTML = videos.map(video => `
    <div class="video-admin-item">

      <img
        src="${escapeHTML(video.thumbnailUrl)}"
        alt="${escapeHTML(video.title)}"
        onerror="this.src='https://via.placeholder.com/600x350?text=DesiHub'"
      >

      <div class="video-admin-info">
        <h4>${escapeHTML(video.title)}</h4>
        <p>Category: ${escapeHTML(video.category)}</p>
        <p>Duration: ${escapeHTML(video.duration || "-")}</p>
      </div>

      <button
        class="delete-btn"
        onclick="deleteVideo('${escapeHTML(video.id)}')"
      >
        Delete
      </button>

    </div>
  `).join("");
}

function deleteVideo(id) {
  const videos = getVideos();

  const video = videos.find(v => v.id === id);

  if (!video) {
    showToast("Video नहीं मिला");
    return;
  }

  const confirmDelete = confirm(
    `क्या "${video.title}" को delete करना है?`
  );

  if (!confirmDelete) return;

  const updatedVideos = videos.filter(v => v.id !== id);

  saveVideos(updatedVideos);

  loadVideos();
  loadDashboard();

  showToast("Video delete हो गया");
}

/* Users */

function loadUsers() {
  const tbody = document.getElementById("usersTableBody");

  if (!tbody) return;

  const users = getUsers();

  if (!users.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="3">अभी कोई user नहीं है।</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = users.map(user => {

    let subscription = "Free";
    let expiry = "-";

    if (
      user.subscription &&
      user.expiry &&
      new Date(user.expiry).getTime() > Date.now()
    ) {
      subscription = user.subscription;
      expiry = formatDate(user.expiry);
    }

    return `
      <tr>
        <td>
          ${escapeHTML(user.email)}
        </td>

        <td>
          ${escapeHTML(subscription)}
        </td>

        <td>
          ${escapeHTML(expiry)}
        </td>
      </tr>
    `;

  }).join("");
}

/* Date */

function formatDate(dateString) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("hi-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

/* Toast */

function showToast(message) {
  const toast = document.getElementById("toast");

  if (!toast) return;

  toast.textContent = message;
  toast.style.display = "block";

  clearTimeout(window.adminToastTimer);

  window.adminToastTimer = setTimeout(() => {
    toast.style.display = "none";
  }, 2500);
}

/* Security note:
   यह अभी frontend/demo admin panel है।
   Real admin security backend पर करनी होगी।
*/

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

window.showSection = showSection;
window.deleteVideo = deleteVideo;
window.showToast = showToast;
