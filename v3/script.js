// Clean Apple-inspired Social Media App
// Main application state and functionality

// Application State
let currentUser = {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    avatar: "JD",
    bio: "Software Developer",
    posts: 42,
    followers: 1234,
    following: 567
};

let posts = [
    {
        id: 1,
        author: { name: "John Doe", avatar: "JD", id: 1 },
        content: "Just launched a new project! Clean design and smooth interactions make all the difference. Sometimes the best solutions are the simplest ones.",
        image: null,
        timestamp: "2 hours ago",
        likes: 24,
        comments: 7,
        isOwner: true,
        liked: false
    },
    {
        id: 2,
        author: { name: "Sarah Wilson", avatar: "SW", id: 2 },
        content: "Beautiful morning view from the office. There's something inspiring about natural light and clean spaces that sparks creativity.",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
        timestamp: "4 hours ago",
        likes: 156,
        comments: 23,
        isOwner: false,
        liked: false
    },
    {
        id: 3,
        author: { name: "Alex Chen", avatar: "AC", id: 3 },
        content: "Learning something new every day in JavaScript. The ecosystem keeps evolving, and it's exciting to see how clean code principles apply across different frameworks.",
        image: null,
        timestamp: "8 hours ago",
        likes: 89,
        comments: 31,
        isOwner: false,
        liked: true
    }
];

let comments = {
    1: [
        { id: 1, author: { name: "Sarah Wilson", avatar: "SW" }, text: "Love the clean aesthetic! Great work on this.", timestamp: "1 hour ago" },
        { id: 2, author: { name: "Alex Chen", avatar: "AC" }, text: "The attention to detail really shows. Inspiring stuff!", timestamp: "45 minutes ago" }
    ],
    2: [
        { id: 1, author: { name: "John Doe", avatar: "JD" }, text: "Such a peaceful workspace! Where is this?", timestamp: "3 hours ago" },
        { id: 2, author: { name: "Alex Chen", avatar: "AC" }, text: "Natural light makes such a difference for productivity.", timestamp: "2 hours ago" }
    ],
    3: [
        { id: 1, author: { name: "John Doe", avatar: "JD" }, text: "Couldn't agree more! Clean code is a joy to work with.", timestamp: "7 hours ago" }
    ]
};

// DOM Elements
const navbar = document.getElementById('navbar');
const searchInput = document.getElementById('searchInput');
const userDropdown = document.getElementById('userDropdown');

// Page Management
function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById(pageName + 'Page');
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Update navigation state
        updateNavigation(pageName);
        
        // Load page-specific content
        switch (pageName) {
            case 'feed':
                loadPosts();
                break;
            case 'profile':
                loadUserProfile();
                break;
        }
    }
}

function updateNavigation(pageName) {
    // Show/hide navbar
    if (pageName === 'login' || pageName === 'register') {
        navbar.classList.remove('show');
    } else {
        navbar.classList.add('show');
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        if (pageName === 'feed') {
            document.querySelector('[onclick="showPage(\'feed\')"]').classList.add('active');
        } else if (pageName === 'profile') {
            document.querySelector('[onclick="showPage(\'profile\')"]').classList.add('active');
        }
    }
}

// Authentication
function setupAuthForms() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });
    
    // Register form
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handleRegister();
    });
}

function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const submitBtn = document.querySelector('#loginForm button[type="submit"]');
    
    if (!email || !password) {
        showMessage('loginMessage', 'Please fill in all fields.', 'error');
        shakeElement(document.querySelector('.auth-content'));
        return;
    }
    
    // Show loading state
    setButtonLoading(submitBtn, 'Signing In...');
    
    // Simulate API call
    setTimeout(() => {
        showMessage('loginMessage', 'Welcome back! Redirecting...', 'success');
        
        setTimeout(() => {
            showPage('feed');
            resetButton(submitBtn, 'Sign In');
        }, 1000);
    }, 800);
}

function handleRegister() {
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value.trim();
    const bio = document.getElementById('registerBio').value.trim();
    const submitBtn = document.querySelector('#registerForm button[type="submit"]');
    
    if (!name || !email || !password) {
        showMessage('registerMessage', 'Please fill in all required fields.', 'error');
        shakeElement(document.querySelector('.auth-content'));
        return;
    }
    
    // Show loading state
    setButtonLoading(submitBtn, 'Creating Account...');
    
    // Update user data
    currentUser.name = name;
    currentUser.email = email;
    currentUser.bio = bio || currentUser.bio;
    currentUser.avatar = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    
    // Simulate API call
    setTimeout(() => {
        showMessage('registerMessage', 'Account created successfully!', 'success');
        
        setTimeout(() => {
            showPage('feed');
            resetButton(submitBtn, 'Create Account');
        }, 1000);
    }, 1000);
}

function logout() {
    toggleDropdown();
    showPage('login');
    
    setTimeout(() => {
        showMessage('loginMessage', 'You have been signed out.', 'success');
    }, 300);
}

// Posts Management
function loadPosts() {
    const container = document.getElementById('postsContainer');
    
    // Show loading state
    container.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>Loading posts...</p>
        </div>
    `;
    
    // Simulate loading delay
    setTimeout(() => {
        container.innerHTML = '';
        
        if (posts.length === 0) {
            showEmptyState(container, 'No posts yet', 'Share your first thought with the community');
            return;
        }
        
        // Render posts with staggered animation
        posts.forEach((post, index) => {
            setTimeout(() => {
                const postElement = createPostElement(post);
                container.appendChild(postElement);
                animateIn(postElement);
            }, index * 100);
        });
    }, 600);
}

function createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'card post-card';
    postDiv.onclick = () => openPostModal(post);
    
    postDiv.innerHTML = `
        <div class="post-header">
            <div class="user-avatar">
                <span class="avatar">${post.author.avatar}</span>
            </div>
            <div class="post-user-info">
                <div class="post-user-name">${post.author.name}</div>
                <div class="post-time">${post.timestamp}</div>
            </div>
            ${post.isOwner ? createPostMenu(post.id) : ''}
        </div>
        
        <div class="post-content">${post.content}</div>
        
        ${post.image ? `<img src="${post.image}" alt="Post image" class="post-image">` : ''}
        
        <div class="post-actions">
            ${createPostActions(post)}
        </div>
    `;
    
    return postDiv;
}

function createPostMenu(postId) {
    return `
        <div class="dropdown">
            <button class="post-menu-btn" onclick="event.stopPropagation(); togglePostMenu(${postId})">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="2" r="1.5" fill="currentColor"/>
                    <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
                    <circle cx="8" cy="14" r="1.5" fill="currentColor"/>
                </svg>
            </button>
            <div class="dropdown-menu" id="postMenu${postId}">
                <div class="dropdown-content">
                    <a href="#" onclick="event.stopPropagation(); editPost(${postId})" class="dropdown-item">
                        <span>Edit</span>
                    </a>
                    <a href="#" onclick="event.stopPropagation(); deletePost(${postId})" class="dropdown-item text-red">
                        <span>Delete</span>
                    </a>
                </div>
            </div>
        </div>
    `;
}

function createPostActions(post) {
    return `
        <button class="post-action ${post.liked ? 'liked' : ''}" onclick="event.stopPropagation(); toggleLike(${post.id})">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="${post.liked ? 'currentColor' : 'none'}">
                <path d="M8 14s-4-3-6-6c-1-1.5-1-3.5 1-5s4-1 5 1c1-2 3-3 5-1s2 3.5 1 5c-2 3-6 6-6 6z" stroke="currentColor" stroke-width="1.5"/>
            </svg>
            <span>${post.likes}</span>
        </button>
        
        <button class="post-action" onclick="event.stopPropagation(); openPostModal(${JSON.stringify(post).replace(/"/g, '&quot;')})">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1C4 1 1 3.5 1 6.5c0 2 1 3.5 2.5 4.5L2 15l4-2c.5.1 1 .2 1.5.2 0 0 .3 0 .5 0" stroke="currentColor" stroke-width="1.5"/>
            </svg>
            <span>${post.comments}</span>
        </button>
        
        <button class="post-action" onclick="event.stopPropagation(); sharePost(${post.id})">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 8h8m0 0l-3-3m3 3l-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <span>Share</span>
        </button>
    `;
}

function createPost() {
    const content = document.getElementById('newPostContent').value.trim();
    if (!content) {
        shakeElement(document.getElementById('newPostContent'));
        return;
    }
    
    const newPost = {
        id: posts.length + 1,
        author: { 
            name: currentUser.name, 
            avatar: currentUser.avatar, 
            id: currentUser.id 
        },
        content: content,
        image: null,
        timestamp: "Just now",
        likes: 0,
        comments: 0,
        isOwner: true,
        liked: false
    };
    
    posts.unshift(newPost);
    document.getElementById('newPostContent').value = '';
    
    // Show success feedback
    showToast('Post shared successfully!', 'success');
    
    // Reload posts
    loadPosts();
}

// Post Actions
function toggleLike(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
    
    // Update UI immediately
    const likeBtn = document.querySelector(`[onclick*="toggleLike(${postId})"]`);
    if (likeBtn) {
        likeBtn.classList.toggle('liked', post.liked);
        likeBtn.querySelector('span').textContent = post.likes;
        
        // Update icon
        const svg = likeBtn.querySelector('svg path');
        svg.setAttribute('fill', post.liked ? 'currentColor' : 'none');
    }
    
    // Show feedback
    showToast(post.liked ? 'Liked!' : 'Unliked', 'success');
}

function sharePost(postId) {
    showToast('Post shared!', 'success');
}

function togglePostMenu(postId) {
    // Close all other menus
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        if (menu.id !== `postMenu${postId}`) {
            menu.classList.remove('show');
        }
    });
    
    const menu = document.getElementById(`postMenu${postId}`);
    menu.classList.toggle('show');
}

function editPost(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post || !post.isOwner) return;
    
    document.getElementById('editPostContent').value = post.content;
    document.getElementById('editPostModal').classList.add('show');
    document.getElementById('editPostModal').dataset.postId = postId;
    
    togglePostMenu(postId);
}

function deletePost(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post || !post.isOwner) return;
    
    if (confirm('Are you sure you want to delete this post?')) {
        posts = posts.filter(p => p.id !== postId);
        loadPosts();
        showToast('Post deleted', 'success');
    }
    
    togglePostMenu(postId);
}

// Modal Management
function openPostModal(post) {
    const modal = document.getElementById('postModal');
    const content = document.getElementById('modalPostContent');
    
    const postComments = comments[post.id] || [];
    
    content.innerHTML = `
        <div class="post-card" style="border: none; box-shadow: none; margin: 0; cursor: default;">
            <div class="post-header">
                <div class="user-avatar">
                    <span class="avatar">${post.author.avatar}</span>
                </div>
                <div class="post-user-info">
                    <div class="post-user-name">${post.author.name}</div>
                    <div class="post-time">${post.timestamp}</div>
                </div>
            </div>
            
            <div class="post-content">${post.content}</div>
            
            ${post.image ? `<img src="${post.image}" alt="Post image" class="post-image">` : ''}
            
            <div class="post-actions">
                ${createPostActions(post)}
            </div>
            
            <div class="comments-section">
                <h4>Comments</h4>
                <div class="comments-list">
                    ${postComments.map(comment => `
                        <div class="comment">
                            <div class="comment-avatar">
                                <span class="avatar">${comment.author.avatar}</span>
                            </div>
                            <div class="comment-content">
                                <div class="comment-author">${comment.author.name}</div>
                                <div class="comment-text">${comment.text}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="comment-form">
                    <div class="comment-avatar">
                        <span class="avatar">${currentUser.avatar}</span>
                    </div>
                    <textarea class="comment-input" placeholder="Write a comment..." id="commentInput${post.id}" rows="1"></textarea>
                    <button class="comment-submit" onclick="addComment(${post.id})">Post</button>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('show');
}

function closeModal() {
    document.getElementById('postModal').classList.remove('show');
}

function closeEditModal() {
    document.getElementById('editPostModal').classList.remove('show');
}

function addComment(postId) {
    const input = document.getElementById(`commentInput${postId}`);
    const commentText = input.value.trim();
    
    if (!commentText) {
        shakeElement(input);
        return;
    }
    
    if (!comments[postId]) {
        comments[postId] = [];
    }
    
    const newComment = {
        id: comments[postId].length + 1,
        author: { name: currentUser.name, avatar: currentUser.avatar },
        text: commentText,
        timestamp: "Just now"
    };
    
    comments[postId].push(newComment);
    
    // Update post comment count
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.comments++;
    }
    
    input.value = '';
    showToast('Comment added!', 'success');
    
    // Refresh modal content
    openPostModal(posts.find(p => p.id === postId));
}

// Edit Post Form
function setupEditPostForm() {
    document.getElementById('editPostForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const postId = parseInt(document.getElementById('editPostModal').dataset.postId);
        const newContent = document.getElementById('editPostContent').value.trim();
        
        if (!newContent) {
            shakeElement(document.getElementById('editPostContent'));
            return;
        }
        
        const post = posts.find(p => p.id === postId);
        if (post && post.isOwner) {
            post.content = newContent;
            loadPosts();
            closeEditModal();
            showToast('Post updated!', 'success');
        }
    });
}

// Profile Management
function loadUserProfile() {
    // Update profile info
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileBio').textContent = currentUser.bio;
    document.getElementById('profileAvatar').textContent = currentUser.avatar;
    document.getElementById('profilePosts').textContent = currentUser.posts;
    document.getElementById('profileFollowers').textContent = formatNumber(currentUser.followers);
    document.getElementById('profileFollowing').textContent = currentUser.following;
    
    // Load user posts
    const container = document.getElementById('userPostsContainer');
    const userPosts = posts.filter(post => post.isOwner);
    
    container.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>Loading your posts...</p>
        </div>
    `;
    
    setTimeout(() => {
        container.innerHTML = '';
        
        if (userPosts.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📝</div>
                    <h3>No posts yet</h3>
                    <p>Share your first thought with the community</p>
                    <button class="btn-primary" onclick="showPage('feed')">Create Post</button>
                </div>
            `;
        } else {
            userPosts.forEach((post, index) => {
                setTimeout(() => {
                    const postElement = createPostElement(post);
                    container.appendChild(postElement);
                    animateIn(postElement);
                }, index * 100);
            });
        }
    }, 600);
}

// Search Functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    let searchTimeout;
    
    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim().toLowerCase();
        
        searchTimeout = setTimeout(() => {
            if (query === '') {
                loadPosts();
                return;
            }
            
            const filteredPosts = posts.filter(post => 
                post.content.toLowerCase().includes(query) ||
                post.author.name.toLowerCase().includes(query)
            );
            
            displaySearchResults(filteredPosts, query);
        }, 300);
    });
}

function displaySearchResults(filteredPosts, query) {
    const container = document.getElementById('postsContainer');
    container.innerHTML = '';
    
    if (filteredPosts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🔍</div>
                <h3>No results found</h3>
                <p>No posts match "${query}"</p>
                <button class="btn-secondary" onclick="clearSearch()">Clear Search</button>
            </div>
        `;
    } else {
        filteredPosts.forEach((post, index) => {
            setTimeout(() => {
                const postElement = createPostElement(post);
                container.appendChild(postElement);
                animateIn(postElement);
            }, index * 50);
        });
    }
}

function clearSearch() {
    document.getElementById('searchInput').value = '';
    loadPosts();
}

// Dropdown Management
function toggleDropdown() {
    userDropdown.classList.toggle('show');
}

function showSettings() {
    toggleDropdown();
    showToast('Settings would open here', 'success');
}

// Utility Functions
function showMessage(elementId, message, type) {
    const element = document.getElementById(elementId);
    element.innerHTML = `<div class="message ${type}">${message}</div>`;
    
    setTimeout(() => {
        element.innerHTML = '';
    }, 5000);
}

function showToast(message, type = 'success') {
    // Remove existing toasts
    document.querySelectorAll('.toast').forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.style.cssText = `
        position: fixed;
        top: 80px;
        right: 24px;
        background: ${type === 'success' ? 'var(--success-green)' : 'var(--danger-red)'};
        color: white;
        padding: 12px 20px;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        font-size: 14px;
        font-weight: 500;
        z-index: 3000;
        animation: toastSlideIn 0.3s ease-out;
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'toastSlideOut 0.3s ease-in forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function setButtonLoading(button, text) {
    button.disabled = true;
    button.innerHTML = `
        <div class="loading-spinner" style="width: 16px; height: 16px; margin-right: 8px;"></div>
        ${text}
    `;
}

function resetButton(button, text) {
    button.disabled = false;
    button.innerHTML = text;
}

function shakeElement(element) {
    element.classList.add('shake');
    setTimeout(() => element.classList.remove('shake'), 500);
}

function animateIn(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        element.style.transition = 'all 0.4s ease-out';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, 50);
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function showEmptyState(container, title, message) {
    container.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">📭</div>
            <h3>${title}</h3>
            <p>${message}</p>
        </div>
    `;
}

// Event Listeners
function setupEventListeners() {
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.remove('show');
            });
        }
        
        // Close modals when clicking backdrop
        if (e.target.classList.contains('modal-backdrop')) {
            closeModal();
            closeEditModal();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Cmd/Ctrl + K for search
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
            searchInput.select();
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            closeModal();
            closeEditModal();
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.remove('show');
            });
        }
        
        // Cmd/Ctrl + Enter to submit forms
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            const activeElement = document.activeElement;
            
            if (activeElement.id === 'newPostContent') {
                createPost();
            } else if (activeElement.id === 'editPostContent') {
                document.getElementById('editPostForm').dispatchEvent(new Event('submit'));
            }
        }
    });
    
    // Auto-resize textareas
    document.addEventListener('input', function(e) {
        if (e.target.matches('textarea')) {
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
        }
    });
}

// Initialization
function initializeApp() {
    console.log('🍎 Initializing SocialConnect...');
    
    // Setup all functionality
    setupAuthForms();
    setupEditPostForm();
    setupSearch();
    setupEventListeners();
    
    // Show initial page
    showPage('login');
    
    // Add CSS for animations
    addDynamicStyles();
    
    console.log('✨ App initialized successfully!');
    console.log('💡 Tip: Use ⌘+K to search, ⌘+Enter to post');
}

function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes toastSlideIn {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes toastSlideOut {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }
        
        .toast {
            animation: toastSlideIn 0.3s ease-out;
        }
        
        /* Smooth focus transitions */
        .form-input:focus,
        .form-textarea:focus,
        .search-input:focus,
        .post-textarea:focus,
        .comment-input:focus {
            transform: scale(1.01);
        }
        
        /* Hover effects for interactive elements */
        .card:hover {
            transform: translateY(-2px);
        }
        
        .btn-primary:hover:not(:disabled),
        .btn-secondary:hover {
            transform: translateY(-1px);
        }
        
        .avatar:hover {
            transform: scale(1.1);
        }
        
        /* Loading state styles */
        .btn-primary:disabled {
            transform: none !important;
        }
        
        /* Auto-resize textarea */
        textarea {
            overflow: hidden;
            resize: none;
        }
    `;
    document.head.appendChild(style);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Export for testing (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showPage,
        createPost,
        toggleLike,
        loadPosts,
        loadUserProfile
    };
}