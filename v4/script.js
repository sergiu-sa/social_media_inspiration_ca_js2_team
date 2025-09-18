// Premium Social Media Application - JavaScript
class SocialMediaApp {
  constructor() {
    this.currentUser = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
      isOnline: true,
    };

    this.posts = [];
    this.notifications = [];
    this.currentPage = "feed";
    this.isLoading = false;
    this.searchTimeout = null;

    this.init();
  }

  init() {
    this.showLoadingScreen();
    this.setupEventListeners();
    this.generateSamplePosts();
    this.generateSampleNotifications();

    // Simulate app loading
    setTimeout(() => {
      this.hideLoadingScreen();
      this.showAuthPage();
    }, 2500);
  }

  // Loading Screen Management
  showLoadingScreen() {
    const loadingScreen = document.getElementById("loadingScreen");
    loadingScreen.classList.remove("hidden");

    // Add floating elements animation
    this.animateFloatingElements();
  }

  hideLoadingScreen() {
    const loadingScreen = document.getElementById("loadingScreen");
    loadingScreen.classList.add("hidden");
  }

  animateFloatingElements() {
    const elements = document.querySelectorAll(".floating-element");
    elements.forEach((element, index) => {
      element.style.animationDelay = `${index * 0.5}s`;
    });
  }

  // Authentication Management
  showAuthPage() {
    const authContainer = document.getElementById("authContainer");
    const mainApp = document.getElementById("mainApp");

    authContainer.classList.remove("hidden");
    mainApp.classList.add("hidden");

    this.animateFloatingShapes();
  }

  showMainApp() {
    const authContainer = document.getElementById("authContainer");
    const mainApp = document.getElementById("mainApp");

    authContainer.classList.add("hidden");
    mainApp.classList.remove("hidden");

    this.showPage("feed");
    this.loadPosts();
  }

  animateFloatingShapes() {
    const shapes = document.querySelectorAll(".shape");
    shapes.forEach((shape, index) => {
      shape.style.animationDelay = `${index * 2}s`;
    });
  }

  // Event Listeners Setup
  setupEventListeners() {
    // Auth form switching
    document.getElementById("showRegister")?.addEventListener("click", (e) => {
      e.preventDefault();
      this.switchAuthPage("register");
    });

    document.getElementById("showLogin")?.addEventListener("click", (e) => {
      e.preventDefault();
      this.switchAuthPage("login");
    });

    // Form submissions
    document.getElementById("loginForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleLogin(e);
    });

    document.getElementById("registerForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleRegister(e);
    });

    // Navigation
    document.getElementById("logoutBtn")?.addEventListener("click", (e) => {
      e.preventDefault();
      this.handleLogout();
    });

    // Search functionality
    document.getElementById("searchInput")?.addEventListener("input", (e) => {
      this.handleSearch(e.target.value);
    });

    // Post creation
    document.getElementById("postContent")?.addEventListener("input", (e) => {
      this.updateCharCount(e.target);
      this.validatePost();
    });

    document.getElementById("submitPost")?.addEventListener("click", () => {
      this.createPost();
    });

    // User dropdown
    document
      .querySelector(".user-avatar-btn")
      ?.addEventListener("click", () => {
        this.toggleDropdown("userDropdown");
      });

    // Notifications
    document
      .getElementById("notificationsBtn")
      ?.addEventListener("click", () => {
        this.toggleNotifications();
      });

    // Profile navigation
    document
      .querySelector('[data-page="profile"]')
      ?.addEventListener("click", (e) => {
        e.preventDefault();
        this.showPage("profile");
      });

    // Profile tabs
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.switchTab(btn.dataset.tab);
      });
    });

    // Modal events
    document.getElementById("closePostModal")?.addEventListener("click", () => {
      this.closeModal("postModal");
    });

    document.getElementById("closeEditModal")?.addEventListener("click", () => {
      this.closeModal("editPostModal");
    });

    // Form validation
    this.setupFormValidation();

    // Keyboard shortcuts
    this.setupKeyboardShortcuts();

    // Click outside to close dropdowns
    document.addEventListener("click", (e) => {
      this.handleOutsideClick(e);
    });

    // Password toggles
    document.querySelectorAll(".password-toggle").forEach((toggle) => {
      toggle.addEventListener("click", () => {
        this.togglePassword(toggle);
      });
    });

    // Ripple effects
    this.setupRippleEffects();
  }

  // Auth Page Switching
  switchAuthPage(page) {
    const loginPage = document.getElementById("loginPage");
    const registerPage = document.getElementById("registerPage");

    if (page === "register") {
      loginPage.classList.remove("active");
      registerPage.classList.add("active");
    } else {
      registerPage.classList.remove("active");
      loginPage.classList.add("active");
    }
  }

  // Form Validation
  setupFormValidation() {
    const inputs = document.querySelectorAll("input[required]");

    inputs.forEach((input) => {
      input.addEventListener("blur", () => {
        this.validateField(input);
      });

      input.addEventListener("input", () => {
        this.clearFieldErrors(input);
        if (input.type === "password" && input.id === "registerPassword") {
          this.updatePasswordStrength(input);
        }
        if (input.id === "confirmPassword") {
          this.validatePasswordMatch();
        }
        if (input.type === "email") {
          this.validateEmailRealTime(input);
        }
      });
    });
  }

  validateField(input) {
    const formGroup = input.closest(".form-group");
    const errorMsg = formGroup.querySelector(".error-message");
    let isValid = true;
    let message = "";

    // Clear previous states
    input.classList.remove("error", "success");

    if (!input.value.trim()) {
      message = `${input.labels[0]?.textContent || "This field"} is required`;
      isValid = false;
    } else {
      switch (input.type) {
        case "email":
          if (!this.isValidEmail(input.value)) {
            message = "Please enter a valid email address";
            isValid = false;
          }
          break;
        case "password":
          if (input.value.length < 8) {
            message = "Password must be at least 8 characters long";
            isValid = false;
          }
          break;
      }
    }

    if (isValid) {
      input.classList.add("success");
      this.showSuccessMessage(formGroup, "✓ Looks good!");
    } else {
      input.classList.add("error");
      input.style.animation = "shake 0.5s ease-in-out";
      setTimeout(() => {
        input.style.animation = "";
      }, 500);
      this.showErrorMessage(formGroup, message);
    }

    return isValid;
  }

  validateEmailRealTime(input) {
    const formGroup = input.closest(".form-group");

    if (input.value && this.isValidEmail(input.value)) {
      // Simulate checking if email exists
      setTimeout(() => {
        this.showSuccessMessage(formGroup, "✓ Email available");
      }, 500);
    }
  }

  validatePasswordMatch() {
    const password = document.getElementById("registerPassword");
    const confirmPassword = document.getElementById("confirmPassword");
    const formGroup = confirmPassword.closest(".form-group");

    if (confirmPassword.value && password.value !== confirmPassword.value) {
      confirmPassword.classList.add("error");
      this.showErrorMessage(formGroup, "Passwords do not match");
    } else if (confirmPassword.value) {
      confirmPassword.classList.remove("error");
      confirmPassword.classList.add("success");
      this.showSuccessMessage(formGroup, "✓ Passwords match");
    }
  }

  updatePasswordStrength(input) {
    const strength = this.calculatePasswordStrength(input.value);
    const strengthFill = document.querySelector(".strength-fill");
    const strengthText = document.querySelector(".strength-text");

    strengthFill.className = "strength-fill";

    switch (strength.level) {
      case 1:
        strengthFill.classList.add("weak");
        strengthText.textContent = "Weak password";
        break;
      case 2:
        strengthFill.classList.add("fair");
        strengthText.textContent = "Fair password";
        break;
      case 3:
        strengthFill.classList.add("good");
        strengthText.textContent = "Good password";
        break;
      case 4:
        strengthFill.classList.add("strong");
        strengthText.textContent = "Strong password";
        break;
      default:
        strengthText.textContent = "Password strength";
    }
  }

  calculatePasswordStrength(password) {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return { level: Math.min(score, 4), score };
  }

  showErrorMessage(formGroup, message) {
    const errorMsg = formGroup.querySelector(".error-message");
    if (errorMsg) {
      errorMsg.textContent = message;
      errorMsg.classList.add("show");
    }
  }

  showSuccessMessage(formGroup, message) {
    const successMsg = formGroup.querySelector(".success-message");
    if (successMsg) {
      successMsg.textContent = message;
      successMsg.classList.add("show");
    }
  }

  clearFieldErrors(input) {
    const formGroup = input.closest(".form-group");
    const errorMsg = formGroup.querySelector(".error-message");
    const successMsg = formGroup.querySelector(".success-message");

    if (errorMsg) errorMsg.classList.remove("show");
    if (successMsg) successMsg.classList.remove("show");
    input.classList.remove("error", "success");
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Authentication Handlers
  async handleLogin(e) {
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');

    // Show loading state
    this.setButtonLoading(submitBtn, true);

    // Simulate API call
    await this.delay(2000);

    // Simulate successful login
    this.setButtonLoading(submitBtn, false);
    this.showToast("Welcome back! Login successful.", "success");

    setTimeout(() => {
      this.showMainApp();
    }, 1000);
  }

  async handleRegister(e) {
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');

    // Validate all fields
    const inputs = form.querySelectorAll("input[required]");
    let allValid = true;

    inputs.forEach((input) => {
      if (!this.validateField(input)) {
        allValid = false;
      }
    });

    if (!allValid) {
      this.showToast("Please fix the errors below.", "error");
      return;
    }

    // Show loading state
    this.setButtonLoading(submitBtn, true);

    // Simulate API call
    await this.delay(2500);

    // Simulate successful registration
    this.setButtonLoading(submitBtn, false);
    this.showToast("Account created successfully!", "success");

    setTimeout(() => {
      this.switchAuthPage("login");
    }, 1000);
  }

  handleLogout() {
    this.showToast("Logged out successfully", "success");
    setTimeout(() => {
      this.showAuthPage();
    }, 1000);
  }

  // Password Toggle
  togglePassword(toggle) {
    const input = toggle.closest(".form-group").querySelector("input");
    const icon = toggle.querySelector(".eye-icon");

    if (input.type === "password") {
      input.type = "text";
      icon.textContent = "🙈";
    } else {
      input.type = "password";
      icon.textContent = "👁️";
    }
  }

  // Button Loading States
  setButtonLoading(button, isLoading) {
    const btnText = button.querySelector(".btn-text");
    const btnLoader = button.querySelector(".btn-loader");

    if (isLoading) {
      button.disabled = true;
      btnLoader.classList.remove("hidden");
    } else {
      button.disabled = false;
      btnLoader.classList.add("hidden");
    }
  }

  // Toast Notifications
  showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");

    const icons = {
      success: "✅",
      error: "❌",
      warning: "⚠️",
      info: "ℹ️",
    };

    toast.className = `toast ${type}`;
    toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">${icons[type]}</span>
                <span class="toast-message">${message}</span>
                <button class="toast-close">×</button>
            </div>
        `;

    container.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
      this.removeToast(toast);
    }, 5000);

    // Close button
    toast.querySelector(".toast-close").addEventListener("click", () => {
      this.removeToast(toast);
    });
  }

  removeToast(toast) {
    toast.style.animation = "slideInToast 0.3s ease-out reverse";
    setTimeout(() => {
      toast.remove();
    }, 300);
  }

  // Page Management
  showPage(pageName) {
    // Hide all pages
    document.querySelectorAll(".page").forEach((page) => {
      page.classList.remove("active");
    });

    // Show target page
    const targetPage = document.getElementById(`${pageName}Page`);
    if (targetPage) {
      targetPage.classList.add("active");
      this.currentPage = pageName;

      // Load page-specific content
      if (pageName === "profile") {
        this.loadProfileData();
      }
    }
  }

  // Search Functionality
  handleSearch(query) {
    clearTimeout(this.searchTimeout);

    const searchResults = document.getElementById("searchResults");
    const searchSuggestions = document.getElementById("searchSuggestions");

    if (!query.trim()) {
      searchResults.classList.remove("show");
      searchSuggestions.classList.add("show");
      return;
    }

    searchSuggestions.classList.remove("show");

    this.searchTimeout = setTimeout(() => {
      this.performSearch(query);
    }, 300);
  }

  async performSearch(query) {
    const searchResults = document.getElementById("searchResults");

    // Show loading state
    searchResults.innerHTML =
      '<div class="search-result-item">🔍 Searching...</div>';
    searchResults.classList.add("show");

    // Simulate API call
    await this.delay(500);

    // Mock search results
    const results = this.generateSearchResults(query);

    if (results.length === 0) {
      searchResults.innerHTML =
        '<div class="search-result-item">No results found</div>';
      return;
    }

    searchResults.innerHTML = results
      .map(
        (result) => `
            <div class="search-result-item">
                <div class="suggestion-icon">${
                  result.type === "user" ? "👤" : "📄"
                }</div>
                <span>${result.title}</span>
            </div>
        `
      )
      .join("");
  }

  generateSearchResults(query) {
    // Mock search results
    const mockResults = [
      { type: "user", title: "Sarah Johnson" },
      { type: "user", title: "Mike Chen" },
      { type: "post", title: "Amazing sunset photography tips" },
      { type: "post", title: "Latest tech trends 2024" },
    ];

    return mockResults.filter((result) =>
      result.title.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Post Management
  updateCharCount(textarea) {
    const charCount = document.getElementById("charCount");
    const counter = charCount.closest(".char-counter");
    const length = textarea.value.length;

    charCount.textContent = length;

    counter.classList.remove("warning", "danger");
    if (length > 400) {
      counter.classList.add("warning");
    }
    if (length > 450) {
      counter.classList.add("danger");
    }
  }

  validatePost() {
    const postContent = document.getElementById("postContent");
    const submitBtn = document.getElementById("submitPost");

    const isValid =
      postContent.value.trim().length > 0 && postContent.value.length <= 500;

    submitBtn.disabled = !isValid;
  }

  async createPost() {
    const postContent = document.getElementById("postContent");
    const submitBtn = document.getElementById("submitPost");

    if (!postContent.value.trim()) return;

    this.setButtonLoading(submitBtn, true);

    // Simulate API call
    await this.delay(1500);

    const newPost = {
      id: this.posts.length + 1,
      user: this.currentUser,
      content: postContent.value,
      timestamp: new Date(),
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
    };

    this.posts.unshift(newPost);
    postContent.value = "";
    this.updateCharCount(postContent);
    this.validatePost();

    this.setButtonLoading(submitBtn, false);
    this.showToast("Post created successfully!", "success");

    // Refresh posts display
    this.displayPosts();
  }

  generateSamplePosts() {
    const samplePosts = [
      {
        id: 1,
        user: {
          name: "Sarah Johnson",
          avatar:
            "https://images.unsplash.com/photo-1494790108755-2616b612e886?w=50&h=50&fit=crop&crop=face",
          isOnline: true,
        },
        content:
          "Just finished an amazing photography session at golden hour! The lighting was absolutely perfect. Sometimes the best moments happen when you least expect them. 📸✨",
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        likes: 24,
        comments: 8,
        shares: 3,
        isLiked: false,
      },
      {
        id: 2,
        user: {
          name: "Mike Chen",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
          isOnline: false,
        },
        content:
          "Working on a new React project and loving the latest features! The developer experience just keeps getting better. Who else is excited about the future of web development? 🚀💻",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        likes: 15,
        comments: 12,
        shares: 5,
        isLiked: true,
      },
      {
        id: 3,
        user: {
          name: "Emma Wilson",
          avatar:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
          isOnline: true,
        },
        content:
          "Coffee and code - the perfect combination for a productive morning! ☕ What's your go-to productivity setup?",
        image:
          "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&h=300&fit=crop",
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        likes: 31,
        comments: 6,
        shares: 2,
        isLiked: false,
      },
    ];

    this.posts = [...samplePosts];
  }

  async loadPosts() {
    const postsContainer = document.getElementById("postsContainer");

    // Show skeleton loader
    this.showSkeletonLoader();

    // Simulate API call
    await this.delay(1500);

    // Display posts
    this.displayPosts();
  }

  showSkeletonLoader() {
    const container = document.getElementById("postsContainer");
    const skeletonHTML = `
            <div class="skeleton-loader">
                ${Array(3)
                  .fill(0)
                  .map(
                    () => `
                    <div class="skeleton-post">
                        <div class="skeleton-header">
                            <div class="skeleton-avatar"></div>
                            <div class="skeleton-user-info">
                                <div class="skeleton-line skeleton-name"></div>
                                <div class="skeleton-line skeleton-time"></div>
                            </div>
                        </div>
                        <div class="skeleton-content">
                            <div class="skeleton-line"></div>
                            <div class="skeleton-line"></div>
                            <div class="skeleton-line short"></div>
                        </div>
                        <div class="skeleton-image"></div>
                        <div class="skeleton-actions">
                            <div class="skeleton-btn"></div>
                            <div class="skeleton-btn"></div>
                            <div class="skeleton-btn"></div>
                        </div>
                    </div>
                `
                  )
                  .join("")}
            </div>
        `;

    container.innerHTML = skeletonHTML;
  }

  displayPosts() {
    const container = document.getElementById("postsContainer");

    if (this.posts.length === 0) {
      container.innerHTML = `
                <div class="empty-state">
                    <p>No posts yet. Create your first post!</p>
                </div>
            `;
      return;
    }

    container.innerHTML = this.posts
      .map(
        (post, index) => `
            <div class="post-card" style="animation-delay: ${index * 0.1}s">
                <div class="post-header">
                    <div class="post-avatar">
                        <img src="${post.user.avatar}" alt="${post.user.name}">
                        ${
                          post.user.isOnline
                            ? '<div class="online-status"></div>'
                            : ""
                        }
                    </div>
                    <div class="post-user-info">
                        <div class="post-user-name">${post.user.name}</div>
                        <div class="post-time">${this.formatTime(
                          post.timestamp
                        )}</div>
                    </div>
                    <div class="post-menu">
                        <button class="post-menu-btn" onclick="app.togglePostMenu(${
                          post.id
                        })">⋯</button>
                        <div class="post-menu-dropdown" id="postMenu${post.id}">
                            <div class="post-menu-item" onclick="app.editPost(${
                              post.id
                            })">
                                <span class="icon">✏️</span>
                                <span>Edit</span>
                            </div>
                            <div class="post-menu-item" onclick="app.deletePost(${
                              post.id
                            })">
                                <span class="icon">🗑️</span>
                                <span>Delete</span>
                            </div>
                            <div class="post-menu-item" onclick="app.reportPost(${
                              post.id
                            })">
                                <span class="icon">🚫</span>
                                <span>Report</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="post-content">${post.content}</div>
                ${
                  post.image
                    ? `
                    <div class="post-image">
                        <img src="${post.image}" alt="Post image" onclick="app.viewPost(${post.id})">
                    </div>
                `
                    : ""
                }
                <div class="post-actions">
                    <button class="action-btn-post ${
                      post.isLiked ? "liked" : ""
                    }" onclick="app.toggleLike(${post.id})">
                        <span class="icon">${post.isLiked ? "❤️" : "🤍"}</span>
                        <span>${post.likes}</span>
                    </button>
                    <button class="action-btn-post" onclick="app.viewPost(${
                      post.id
                    })">
                        <span class="icon">💬</span>
                        <span>${post.comments}</span>
                    </button>
                    <button class="action-btn-post" onclick="app.sharePost(${
                      post.id
                    })">
                        <span class="icon">📤</span>
                        <span>${post.shares}</span>
                    </button>
                </div>
            </div>
        `
      )
      .join("");
  }

  // Post Interactions
  toggleLike(postId) {
    const post = this.posts.find((p) => p.id === postId);
    if (!post) return;

    post.isLiked = !post.isLiked;
    post.likes += post.isLiked ? 1 : -1;

    // Add visual feedback
    const likeBtn = document.querySelector(
      `[onclick="app.toggleLike(${postId})"]`
    );
    if (likeBtn) {
      likeBtn.style.animation = "zoomIn 0.3s ease-out";
      setTimeout(() => {
        likeBtn.style.animation = "";
      }, 300);
    }

    this.displayPosts();

    if (post.isLiked) {
      this.showToast("Post liked!", "success");
    }
  }

  viewPost(postId) {
    const post = this.posts.find((p) => p.id === postId);
    if (!post) return;

    const modal = document.getElementById("postModal");
    const modalBody = document.getElementById("postModalBody");

    modalBody.innerHTML = `
            <div class="post-detail">
                <div class="post-header">
                    <div class="post-avatar">
                        <img src="${post.user.avatar}" alt="${post.user.name}">
                        ${
                          post.user.isOnline
                            ? '<div class="online-status"></div>'
                            : ""
                        }
                    </div>
                    <div class="post-user-info">
                        <div class="post-user-name">${post.user.name}</div>
                        <div class="post-time">${this.formatTime(
                          post.timestamp
                        )}</div>
                    </div>
                </div>
                <div class="post-content">${post.content}</div>
                ${
                  post.image
                    ? `<div class="post-image"><img src="${post.image}" alt="Post image"></div>`
                    : ""
                }
                <div class="post-stats">
                    <span>❤️ ${post.likes} likes</span>
                    <span>💬 ${post.comments} comments</span>
                    <span>📤 ${post.shares} shares</span>
                </div>
            </div>
        `;

    this.showModal("postModal");
  }

  editPost(postId) {
    const post = this.posts.find((p) => p.id === postId);
    if (!post) return;

    const modal = document.getElementById("editPostModal");
    const editContent = document.getElementById("editPostContent");
    const editCharCount = document.getElementById("editCharCount");

    editContent.value = post.content;
    editCharCount.textContent = post.content.length;

    this.updateCharCount(editContent);
    this.showModal("editPostModal");

    // Store post ID for update
    modal.dataset.postId = postId;
  }

  async deletePost(postId) {
    if (!confirm("Are you sure you want to delete this post?")) return;

    // Add loading animation
    const postCard = document
      .querySelector(`[onclick="app.togglePostMenu(${postId})"]`)
      .closest(".post-card");
    postCard.style.animation = "slideInPost 0.3s ease-out reverse";

    await this.delay(300);

    this.posts = this.posts.filter((p) => p.id !== postId);
    this.displayPosts();
    this.showToast("Post deleted successfully", "success");
  }

  sharePost(postId) {
    const post = this.posts.find((p) => p.id === postId);
    if (!post) return;

    post.shares += 1;
    this.displayPosts();
    this.showToast("Post shared!", "success");

    // Simulate social sharing
    if (navigator.share) {
      navigator.share({
        title: `Post by ${post.user.name}`,
        text: post.content,
        url: window.location.href,
      });
    }
  }

  reportPost(postId) {
    const post = this.posts.find((p) => p.id === postId);
    if (!post) return;

    if (confirm("Are you sure you want to report this post?")) {
      this.showToast(
        "Post reported. Thank you for keeping our community safe.",
        "success"
      );

      // Close post menu
      document.querySelectorAll(".post-menu-dropdown").forEach((menu) => {
        menu.classList.remove("show");
      });
    }
  }

  togglePostMenu(postId) {
    const menu = document.getElementById(`postMenu${postId}`);
    const isVisible = menu.classList.contains("show");

    // Close all other menus
    document.querySelectorAll(".post-menu-dropdown").forEach((m) => {
      m.classList.remove("show");
    });

    if (!isVisible) {
      menu.classList.add("show");
    }
  }

  // Dropdown Management
  toggleDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    const menu = dropdown.querySelector(".dropdown-menu");

    menu.classList.toggle("show");
  }

  toggleNotifications() {
    const dropdown = document.getElementById("notificationsDropdown");
    dropdown.classList.toggle("show");

    if (dropdown.classList.contains("show")) {
      this.markNotificationsAsRead();
    }
  }

  markNotificationsAsRead() {
    const badge = document.querySelector(
      "#notificationsBtn .notification-badge"
    );
    const unreadItems = document.querySelectorAll(".notification-item.unread");

    setTimeout(() => {
      unreadItems.forEach((item) => {
        item.classList.remove("unread");
      });
      if (badge) {
        badge.style.animation = "fadeOut 0.3s ease-out";
        setTimeout(() => badge.remove(), 300);
      }
    }, 1000);
  }

  handleOutsideClick(e) {
    // Close dropdowns when clicking outside
    const dropdowns = [
      "userDropdown",
      "notificationsDropdown",
      "searchResults",
      "searchSuggestions",
    ];

    dropdowns.forEach((id) => {
      const dropdown = document.getElementById(id);
      if (
        dropdown &&
        !dropdown.contains(e.target) &&
        !e.target.closest(`[data-dropdown="${id}"]`) &&
        !e.target.closest(".user-avatar-btn") &&
        !e.target.closest("#notificationsBtn") &&
        !e.target.closest("#searchInput")
      ) {
        const menu = dropdown.querySelector(
          ".dropdown-menu, .notifications-dropdown"
        );
        if (menu) menu.classList.remove("show");
        dropdown.classList.remove("show");
      }
    });

    // Close post menus
    document.querySelectorAll(".post-menu-dropdown").forEach((menu) => {
      if (!menu.contains(e.target) && !e.target.closest(".post-menu-btn")) {
        menu.classList.remove("show");
      }
    });
  }

  // Modal Management
  showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add("show");

    // Add backdrop click handler
    const backdrop = modal.querySelector(".modal-backdrop");
    backdrop.addEventListener("click", () => {
      this.closeModal(modalId);
    });
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove("show");
  }

  // Profile Management
  loadProfileData() {
    const profilePosts = document.getElementById("profilePosts");

    // Show skeleton loader for profile
    profilePosts.innerHTML = `
            <div class="skeleton-loader">
                <div class="skeleton-post">
                    <div class="skeleton-header">
                        <div class="skeleton-avatar"></div>
                        <div class="skeleton-user-info">
                            <div class="skeleton-line skeleton-name"></div>
                            <div class="skeleton-line skeleton-time"></div>
                        </div>
                    </div>
                    <div class="skeleton-content">
                        <div class="skeleton-line"></div>
                        <div class="skeleton-line"></div>
                        <div class="skeleton-line short"></div>
                    </div>
                </div>
            </div>
        `;

    setTimeout(() => {
      // Display user's posts
      const userPosts = this.posts.filter(
        (post) => post.user.name === this.currentUser.name
      );
      if (userPosts.length === 0) {
        profilePosts.innerHTML =
          '<p class="empty-state">No posts yet. Share your first post!</p>';
      } else {
        profilePosts.innerHTML = userPosts
          .map(
            (post, index) => `
                    <div class="post-card" style="animation-delay: ${
                      index * 0.1
                    }s">
                        <div class="post-content">${post.content}</div>
                        ${
                          post.image
                            ? `<div class="post-image"><img src="${post.image}" alt="Post image"></div>`
                            : ""
                        }
                        <div class="post-stats">
                            <span>❤️ ${post.likes}</span>
                            <span>💬 ${post.comments}</span>
                            <span>📤 ${post.shares}</span>
                        </div>
                    </div>
                `
          )
          .join("");
      }
    }, 800);
  }

  switchTab(tabName) {
    // Remove active class from all tabs and content
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    document.querySelectorAll(".tab-content").forEach((content) => {
      content.classList.remove("active");
    });

    // Add active class to clicked tab and corresponding content
    document.querySelector(`[data-tab="${tabName}"]`).classList.add("active");
    document.getElementById(`${tabName}Tab`).classList.add("active");
  }

  // Notification System
  generateSampleNotifications() {
    this.notifications = [
      {
        id: 1,
        user: {
          name: "Sarah Johnson",
          avatar:
            "https://images.unsplash.com/photo-1494790108755-2616b612e886?w=50&h=50&fit=crop&crop=face",
        },
        type: "like",
        message: "liked your post",
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        isRead: false,
      },
      {
        id: 2,
        user: {
          name: "Mike Chen",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
        },
        type: "comment",
        message: "commented on your post",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        isRead: false,
      },
      {
        id: 3,
        user: {
          name: "Emma Wilson",
          avatar:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
        },
        type: "follow",
        message: "started following you",
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        isRead: true,
      },
    ];
  }

  // Ripple Effects
  setupRippleEffects() {
    document.querySelectorAll(".btn-ripple").forEach((button) => {
      button.addEventListener("click", (e) => {
        this.createRipple(e, button);
      });
    });
  }

  createRipple(event, button) {
    const ripple = document.createElement("span");
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    ripple.classList.add("ripple-effect");

    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  // Keyboard Shortcuts
  setupKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      // Ctrl/Cmd + K for search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("searchInput")?.focus();
      }

      // Escape to close modals and dropdowns
      if (e.key === "Escape") {
        // Close modals
        document.querySelectorAll(".modal.show").forEach((modal) => {
          modal.classList.remove("show");
        });

        // Close dropdowns
        document
          .querySelectorAll(".dropdown-menu.show, .notifications-dropdown.show")
          .forEach((dropdown) => {
            dropdown.classList.remove("show");
          });

        // Clear search
        const searchInput = document.getElementById("searchInput");
        if (searchInput === document.activeElement) {
          searchInput.blur();
        }
      }

      // Ctrl/Cmd + Enter to submit forms
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        const activeElement = document.activeElement;

        if (activeElement.id === "postContent") {
          e.preventDefault();
          this.createPost();
        }
      }

      // Arrow keys for navigation (when not in input)
      if (!["input", "textarea"].includes(e.target.tagName.toLowerCase())) {
        if (e.key === "h" && this.currentPage !== "feed") {
          this.showPage("feed");
        }
        if (e.key === "p" && this.currentPage !== "profile") {
          this.showPage("profile");
        }
      }
    });
  }

  // Utility Functions
  formatTime(timestamp) {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;

    return timestamp.toLocaleDateString();
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Animation Helpers
  animateElement(element, animation) {
    element.style.animation = animation;
    return new Promise((resolve) => {
      element.addEventListener("animationend", resolve, { once: true });
    });
  }

  // Performance Optimization
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // Advanced Features
  setupInfiniteScroll() {
    let isLoading = false;

    window.addEventListener(
      "scroll",
      this.throttle(() => {
        if (
          window.innerHeight + window.scrollY >=
            document.body.offsetHeight - 1000 &&
          !isLoading
        ) {
          isLoading = true;
          this.loadMorePosts().finally(() => {
            isLoading = false;
          });
        }
      }, 250)
    );
  }

  async loadMorePosts() {
    // Simulate loading more posts
    const loadingIndicator = document.createElement("div");
    loadingIndicator.className = "loading-more";
    loadingIndicator.innerHTML =
      '<div class="spinner-ring"></div><span>Loading more posts...</span>';

    document.getElementById("postsContainer").appendChild(loadingIndicator);

    await this.delay(1000);

    // Add more sample posts
    const morePosts = [
      {
        id: this.posts.length + 1,
        user: {
          name: "Alex Rodriguez",
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
          isOnline: true,
        },
        content:
          "Beautiful day for a hike! Nature always helps clear the mind. 🏔️🌿",
        timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000),
        likes: 18,
        comments: 4,
        shares: 1,
        isLiked: false,
      },
    ];

    this.posts.push(...morePosts);
    loadingIndicator.remove();
    this.displayPosts();
  }

  // Theme Management
  toggleTheme() {
    document.body.classList.toggle("light-theme");
    // Note: localStorage not available in artifacts environment
    this.showToast("Theme updated!", "success");
  }

  loadTheme() {
    // Default to dark theme in artifacts
    console.log("Theme loaded (localStorage disabled in artifacts)");
  }

  // Data Persistence (Mock)
  saveToLocal() {
    // Note: localStorage not available in artifacts environment
    console.log("Data saved (localStorage disabled in artifacts)");
  }

  loadFromLocal() {
    // Note: localStorage not available in artifacts environment
    console.log("Data loaded (localStorage disabled in artifacts)");
  }

  // Error Handling
  handleError(error, userMessage = "Something went wrong") {
    console.error("Application Error:", error);
    this.showToast(userMessage, "error");
  }

  // Accessibility Enhancements
  announceToScreenReader(message) {
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", "polite");
    announcement.setAttribute("aria-atomic", "true");
    announcement.classList.add("sr-only");
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  // Initialize focus management
  setupFocusManagement() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        document.body.classList.add("keyboard-navigation");
      }
    });

    document.addEventListener("mousedown", () => {
      document.body.classList.remove("keyboard-navigation");
    });
  }

  // App lifecycle
  onAppReady() {
    // Setup infinite scroll
    this.setupInfiniteScroll();

    // Load theme
    this.loadTheme();

    // Setup focus management
    this.setupFocusManagement();

    // Load saved data
    this.loadFromLocal();

    // Periodically save data
    setInterval(() => {
      this.saveToLocal();
    }, 30000);

    console.log("🚀 SocialPro app is ready!");
  }
}

// Global CSS for additional animations and effects
const additionalCSS = `
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .loading-more {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--spacing-sm);
        padding: var(--spacing-lg);
        color: var(--text-secondary);
    }
    
    .loading-more .spinner-ring {
        width: 20px;
        height: 20px;
        border: 2px solid transparent;
        border-top: 2px solid var(--primary-color);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    .keyboard-navigation *:focus {
        outline: 2px solid var(--primary-color) !important;
        outline-offset: 2px !important;
    }
    
    .empty-state {
        text-align: center;
        padding: var(--spacing-2xl);
        color: var(--text-muted);
        font-style: italic;
    }
    
    @keyframes fadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.8); }
    }
`;

// Inject additional CSS
const styleSheet = document.createElement("style");
styleSheet.textContent = additionalCSS;
document.head.appendChild(styleSheet);

// Initialize the app when DOM is loaded
let app;

document.addEventListener("DOMContentLoaded", () => {
  app = new SocialMediaApp();

  // Make app globally accessible for onclick handlers
  window.app = app;

  // Make app ready
  setTimeout(() => {
    app.onAppReady();
  }, 3000);
});

// Handle page visibility for performance
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    // Pause animations when tab is not active
    document.body.style.animationPlayState = "paused";
  } else {
    document.body.style.animationPlayState = "running";
  }
});

// Export for global access
window.SocialMediaApp = SocialMediaApp;
