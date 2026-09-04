const VIDEO_KEY = "desihub_videos";
const USER_KEY = "desihub_users";

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

function updateDashboard() {
  const videos = getVideos();
  const users = getUsers();

  const totalVideos = document.getElementById("totalVideos");
  const totalUsers = document.getElementById("totalUsers");
  const activePremium = document.getElementById("activePremium");

  if (totalVideos) totalVideos.textContent = videos.length;
  if (totalUsers) totalUsers.textContent = users.length;

  const premiumUsers = users.filter(user => user.premium === true);
  if (activePremium) activePremium.textContent = premiumUsers.length;
}

function displayVideos() {
  const list = document.getElementById("videoList");
  if (!list) return;

  const videos = getVideos();

  if (videos.length === 0) {
    list.innerHTML = '<div class="empty">No videos added yet.</div>';
    return;
  }

  list.innerHTML = "";

  videos.forEach((video, index) => {
    const item = document.createElement("div");
    item.className = "video-item";

    item.innerHTML = `
      <div>
        <strong>${escapeHTML(video.title)}</strong>
        <br>
        <small>${escapeHTML(video.category || "Other")} • ${escapeHTML(video.duration || "")}</small>
      </div>

      <button class="delete" onclick="deleteVideo(${index})">
        🗑️ Delete
      </button>
    `;

    list.appendChild(item);
  });
}

function escapeHTML(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function deleteVideo(index) {
  const videos = getVideos();

  if (!videos[index]) return;

  if (!confirm("क्या यह video delete करना है?")) return;

  videos.splice(index, 1);
  saveVideos(videos);

  displayVideos();
  updateDashboard();
}

function setupVideoForm() {
  const form = document.getElementById("videoForm");

  if (!form) return;

  form.addEventListener("submit", function(event) {
    event.preventDefault();

    const title = document.getElementById("videoTitle").value.trim();
    const category = document.getElementById("videoCategory").value;
    const url = document.getElementById("videoUrl").value.trim();
    const thumbnail = document.getElementById("thumbnailUrl").value.trim();
    const duration = document.getElementById("videoDuration").value.trim();
    const description = document.getElementById("videoDescription").value.trim();

    if (!title || !category || !url) {
      alert("Title, Category और Video URL भरना जरूरी है।");
      return;
    }

    const videos = getVideos();

    videos.push({
      id: Date.now(),
      title: title,
      category: category,
      url: url,
      thumbnail: thumbnail,
      duration: duration,
      description: description,
      createdAt: new Date().toISOString()
    });

    saveVideos(videos);

    form.reset();

    displayVideos();
    updateDashboard();

    alert("🎉 Video successfully added!");
  });
}

function displayUsers() {
  const table = document.getElementById("usersTableBody");
  if (!table) return;

  const users = getUsers();

  if (users.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="3" class="empty">No users found</td>
      </tr>
    `;
    return;
  }

  table.innerHTML = "";

  users.forEach(user => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${escapeHTML(user.name || "User")}</td>
      <td>${escapeHTML(user.email || "")}</td>
      <td>${user.premium ? "⭐ Active" : "Free"}</td>
    `;

    table.appendChild(row);
  });
}

document.addEventListener("DOMContentLoaded", function() {
  setupVideoForm();
  displayVideos();
  displayUsers();
  updateDashboard();
});
