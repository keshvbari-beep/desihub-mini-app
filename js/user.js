alert("USER JS LOADED");
const USER_KEY = "desihub_users";
const CURRENT_USER_KEY = "desihub_current_user";
const VIDEO_KEY = "desihub_videos";

function getUsers() {
    try {
        return JSON.parse(localStorage.getItem(USER_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem(USER_KEY, JSON.stringify(users));
}

function getVideos() {
    try {
        return JSON.parse(localStorage.getItem(VIDEO_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function login() {
    const emailBox = document.getElementById("loginEmail");
    const passwordBox = document.getElementById("loginPassword");

    if (!emailBox || !passwordBox) {
        alert("Login form नहीं मिला।");
        return;
    }

    const email = emailBox.value.trim().toLowerCase();
    const password = passwordBox.value;

    if (!email || !password) {
        alert("Email और Password डालें।");
        return;
    }

    const users = getUsers();

    const user = users.find(function(u) {
        return u.email === email && u.password === password;
    });

    if (!user) {
        alert("❌ Email या Password गलत है।");
        return;
    }

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

    alert("✅ Login सफल हुआ!");

    showMainApp();
}

function signup() {
    const name = document.getElementById("signupName")?.value.trim();
    const email = document.getElementById("signupEmail")?.value.trim().toLowerCase();
    const password = document.getElementById("signupPassword")?.value;

    if (!name || !email || !password) {
        alert("सभी जानकारी भरें।");
        return;
    }

    const users = getUsers();

    if (users.some(function(u) {
        return u.email === email;
    })) {
        alert("यह Email पहले से registered है।");
        return;
    }

    const user = {
        id: Date.now(),
        name: name,
        email: email,
        password: password,
        premium: false
    };

    users.push(user);
    saveUsers(users);

    localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify(user)
    );

    alert("🎉 Account बन गया!");

    showMainApp();
}

function showMainApp() {
    const auth = document.getElementById("authScreen");
    const app = document.getElementById("mainApp");

    if (auth) auth.style.display = "none";
    if (app) app.style.display = "block";

    loadVideos();
}

function showAuth() {
    const auth = document.getElementById("authScreen");
    const app = document.getElementById("mainApp");

    if (auth) auth.style.display = "block";
    if (app) app.style.display = "none";
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
        grid.innerHTML =
            '<div style="padding:20px;text-align:center">अभी कोई video उपलब्ध नहीं है।</div>';
        return;
    }

    grid.innerHTML = videos.map(function(video, index) {
        return `
            <div class="video-card" onclick="playVideo(${index})">
                <h3>${escapeHTML(video.title)}</h3>
                <p>${escapeHTML(video.category || "")}</p>
                <p>${escapeHTML(video.duration || "")}</p>
            </div>
        `;
    }).join("");
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
    const player = document.getElementById("videoPlayer");
    const modal = document.getElementById("playerModal");

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
        loginForm.onsubmit = function(e) {
            e.preventDefault();
            login();
            return false;
        };
    }

    const signupForm = document.getElementById("signupForm");

    if (signupForm) {
        signupForm.onsubmit = function(e) {
            e.preventDefault();
            signup();
            return false;
        };
    }

    const loginButton = document.getElementById("loginButton");

    if (loginButton) {
        loginButton.onclick = function(e) {
            e.preventDefault();
            login();
            return false;
        };
    }

    const signupButton = document.getElementById("signupButton");

    if (signupButton) {
        signupButton.onclick = function(e) {
            e.preventDefault();
            signup();
            return false;
        };
    }

    const logoutButton = document.getElementById("logoutBtn");

    if (logoutButton) {
        logoutButton.onclick = logout;
    }

    const currentUser =
        localStorage.getItem(CURRENT_USER_KEY);

    if (currentUser) {
        showMainApp();
    } else {
        showAuth();
    }
});
