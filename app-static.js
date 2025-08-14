/**
 * Static GitHub Issue Renderer
 * Handles client-side story switching using hash routing
 * Works completely offline with embedded story data
 */

class StaticGitHubIssueRenderer {
    constructor() {
        this.issue = null;
        this.currentStory = 'uuid'; // default
        this.storiesLoaded = false;
        this.reactionEmojis = {
            '+1': '👍',
            '-1': '👎',
            'laugh': '😄',
            'hooray': '🎉',
            'confused': '😕',
            'heart': '❤️',
            'rocket': '🚀',
            'eyes': '👀'
        };
        
        // Initialize routing
        this.initializeRouting();
        this.initializeTheme();
        this.initializeNavigation();
        
        // Wait for stories to load before rendering
        this.initializeStoryLoading();
    }

    initializeStoryLoading() {
        // Check if stories are already loaded
        if (window.SPOOKY_STORIES && Object.keys(window.SPOOKY_STORIES).length > 0) {
            this.storiesLoaded = true;
            this.showLoadedContent();
            this.loadStoryFromHash();
        } else {
            // Listen for the storiesLoaded event
            window.addEventListener('storiesLoaded', () => {
                this.storiesLoaded = true;
                this.showLoadedContent();
                this.loadStoryFromHash();
            });
        }
    }

    showLoadedContent() {
        // Add class to body to hide skeletons and show content
        console.log('Adding content-loaded class to body');
        document.body.classList.add('content-loaded');
        
        // Add a slight delay to make the loading feel more realistic
        setTimeout(() => {
            console.log('Adding content-revealed class to body');
            document.body.classList.add('content-revealed');
        }, 150);
    }

    initializeRouting() {
        // Listen for hash changes
        window.addEventListener('hashchange', () => {
            this.loadStoryFromHash();
        });

        // Listen for popstate (back/forward buttons)
        window.addEventListener('popstate', () => {
            this.loadStoryFromHash();
        });
    }

    initializeNavigation() {
        // Theme toggle button
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    loadStoryFromHash() {
        // Don't try to load stories if they haven't been loaded yet
        if (!this.storiesLoaded) {
            return;
        }

        const hash = window.location.hash.substring(1); // Remove the #
        const storyId = hash || 'uuid'; // Default to uuid story
        
        if (window.SPOOKY_STORIES[storyId]) {
            this.loadStory(storyId);
        } else {
            // Invalid story ID, redirect to default
            console.warn(`Story '${storyId}' not found, loading default story`);
            window.location.hash = 'uuid';
        }
    }

    loadStory(storyId) {
        if (!window.SPOOKY_STORIES || !window.SPOOKY_STORIES[storyId]) {
            this.showError(`Story '${storyId}' not found`);
            return;
        }

        this.currentStory = storyId;
        this.issue = window.SPOOKY_STORIES[storyId].data;
        
        
        // Update page title
        document.title = `${window.SPOOKY_STORIES[storyId].name} - Spooky GitHub Issues`;
        
        // Render the story
        this.render();
    }


    showError(message) {
        document.getElementById('issue-title').textContent = 'Error Loading Issue';
        document.getElementById('issue-body').innerHTML = `<p style="color: var(--color-danger-fg);">${message}</p>`;
    }

    render() {
        if (!this.issue) return;

        this.renderHeader();
        this.renderIssueContent();
        this.renderSidebar();
        this.renderComments();
        
        // Add some spooky effects based on the story
        this.addStorySpecificEffects();
    }

    addStorySpecificEffects() {
        // Add subtle spooky effects based on current story
        const body = document.body;
        
        // Remove existing story classes
        body.classList.remove('story-uuid');
        
        // Add current story class for custom styling
        body.classList.add(`story-${this.currentStory}`);
    }

    renderHeader() {
        const { title, number, state, author, created_at } = this.issue;

        document.getElementById('issue-title').textContent = title;
        document.getElementById('issue-number').textContent = `#${number}`;

        const stateElement = document.getElementById('issue-state');
        stateElement.className = `State State--${state}`;
        stateElement.innerHTML = `
            <svg class="octicon octicon-issue-${state === 'open' ? 'opened' : 'closed'}" viewBox="0 0 16 16" width="16" height="16">
                ${state === 'open' 
                    ? '<path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path>'
                    : '<path d="M11.28 6.78a.75.75 0 0 0-1.06-1.06L7.25 8.69 5.78 7.22a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0l3.5-3.5Z"></path><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0Zm-8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Z"></path>'
                }
            </svg>
            ${state === 'open' ? 'Open' : 'Closed'}
        `;

        this.setAuthorInfo('issue-author', author);
        this.setTimestamp('issue-created-at', created_at);
    }

    renderIssueContent() {
        const { author, body, created_at, reactions } = this.issue;

        this.setAuthorInfo('op-author', author);
        this.setTimestamp('op-created-at', created_at);

        try {
            const issueBodyElement = document.getElementById('issue-body');
            if (issueBodyElement) {
                const parsedBody = marked.parse(body || 'No content available');
                issueBodyElement.innerHTML = parsedBody;
                console.log('Issue body rendered:', parsedBody.length, 'characters');
            } else {
                console.error('Issue body element not found');
            }
        } catch (error) {
            console.error('Error rendering issue body:', error);
            document.getElementById('issue-body').innerHTML = '<p>Error loading content</p>';
        }

        this.renderReactions('issue-reactions', reactions);
    }

    renderSidebar() {
        this.renderAssignees();
        this.renderLabels();
        this.renderMilestone();
        this.renderParticipants();
    }

    renderAssignees() {
        const assigneesList = document.getElementById('assignees-list');
        const { assignees } = this.issue;

        if (!assignees || assignees.length === 0) {
            assigneesList.innerHTML = '<span class="text-muted">None yet</span>';
            return;
        }

        assigneesList.innerHTML = assignees.map(assignee => `
            <div class="assignee-item">
                <img class="avatar" src="${assignee.avatar_url}" alt="${assignee.username}" width="20" height="20">
                <a href="#" class="assignee-link">${assignee.username}</a>
            </div>
        `).join('');
    }

    renderLabels() {
        const labelsList = document.getElementById('labels-list');
        const { labels } = this.issue;

        if (!labels || labels.length === 0) {
            labelsList.innerHTML = '<span class="text-muted">None yet</span>';
            return;
        }

        labelsList.innerHTML = labels.map(label => `
            <a href="#" class="Label" style="background-color: #${label.color};" title="${label.description || ''}">
                ${label.name}
            </a>
        `).join('');
    }

    renderMilestone() {
        const milestoneInfo = document.getElementById('milestone-info');
        const { milestone } = this.issue;

        if (!milestone) {
            milestoneInfo.innerHTML = '<span class="text-muted">No milestone</span>';
            return;
        }

        milestoneInfo.innerHTML = `
            <a href="#" class="milestone-title">${milestone.title}</a>
        `;
    }

    renderParticipants() {
        const participantsList = document.getElementById('participants-list');
        const participantCount = document.getElementById('participant-count');
        const { participants } = this.issue;

        if (!participants || participants.length === 0) {
            participantCount.textContent = '0';
            participantsList.innerHTML = '';
            return;
        }

        participantCount.textContent = participants.length;
        participantsList.innerHTML = participants.map(participant => `
            <div class="participant-item">
                <img class="avatar" src="${participant.avatar_url}" alt="${participant.username}" width="20" height="20" title="${participant.username}">
            </div>
        `).join('');
    }

    renderComments() {
        const commentsTimeline = document.getElementById('comments-timeline');
        const { comments } = this.issue;

        if (!comments || comments.length === 0) {
            return;
        }

        commentsTimeline.innerHTML = comments.map((comment, index) => {
            // Check if this comment is a reply (starts with @mention)
            const isReply = comment.body.trim().startsWith('@');
            const replyClass = isReply ? 'timeline-comment-reply' : '';
            
            return `
            <div class="timeline-comment-wrapper ${replyClass}">
                <div class="timeline-comment">
                    <div class="timeline-comment-header">
                        <div class="timeline-comment-header-text">
                            <strong>
                                <a href="#" class="author">
                                    <img class="avatar" src="${comment.author.avatar_url}" alt="${comment.author.username}" width="20" height="20">
                                    ${comment.author.username}
                                </a>
                            </strong>
                            commented 
                            <a href="#" class="timestamp">
                                <relative-time datetime="${comment.created_at}" title="${new Date(comment.created_at).toLocaleString()}">
                                    ${this.formatRelativeTime(comment.created_at)}
                                </relative-time>
                            </a>
                        </div>
                    </div>
                    
                    <div class="comment-body">
                        <div class="markdown-body">
                            ${marked.parse(comment.body || '')}
                        </div>
                    </div>
                    
                    <div class="comment-reactions">
                        <div class="reaction-summary-item-group">
                            ${this.generateReactionHTML(comment.reactions)}
                        </div>
                    </div>
                </div>
            </div>
        `;
        }).join('');
    }

    renderReactions(containerId, reactions) {
        const container = document.getElementById(containerId);
        container.innerHTML = this.generateReactionHTML(reactions);
    }


    generateReactionHTML(reactions) {
        if (!reactions) return '';

        return Object.entries(reactions)
            .filter(([type, count]) => count > 0)
            .map(([type, count]) => `
                <a href="#" class="reaction-summary-item">
                    <span class="reaction-summary-item-emoji">${this.reactionEmojis[type]}</span>
                    <span class="reaction-summary-item-count">${count}</span>
                </a>
            `).join('');
    }

    setAuthorInfo(prefix, author) {
        document.getElementById(`${prefix}-avatar`).src = author.avatar_url;
        document.getElementById(`${prefix}-avatar`).alt = author.username;
        document.getElementById(`${prefix}-name`).textContent = author.username;
        document.getElementById(`${prefix}-link`).href = `#user/${author.username}`;
    }

    setTimestamp(elementId, timestamp) {
        const element = document.getElementById(elementId);
        const date = new Date(timestamp);
        element.setAttribute('datetime', timestamp);
        element.setAttribute('title', date.toLocaleString());
        element.textContent = this.formatRelativeTime(timestamp);
    }

    formatRelativeTime(timestamp) {
        const now = new Date();
        const date = new Date(timestamp);
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) {
            return 'just now';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 2592000) {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} day${days !== 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 31536000) {
            const months = Math.floor(diffInSeconds / 2592000);
            return `${months} month${months !== 1 ? 's' : ''} ago`;
        } else {
            const years = Math.floor(diffInSeconds / 31536000);
            return `${years} year${years !== 1 ? 's' : ''} ago`;
        }
    }

    toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-color-mode');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-color-mode', newTheme);
        localStorage.setItem('github-theme', newTheme);
        
        // Update theme toggle button
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌓';
        }
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('github-theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-color-mode', savedTheme);
        }
        
        // Update theme toggle button
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            const currentTheme = document.documentElement.getAttribute('data-color-mode');
            themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌓';
        }
    }

    // Get available stories
    getAvailableStories() {
        return Object.keys(window.SPOOKY_STORIES || {});
    }

    // Get current story info
    getCurrentStoryInfo() {
        return window.SPOOKY_STORIES[this.currentStory];
    }

    // Add custom story (for future extensibility)
    addCustomStory(storyId, storyData) {
        if (!window.SPOOKY_STORIES) {
            window.SPOOKY_STORIES = {};
        }
        
        window.SPOOKY_STORIES[storyId] = storyData;
        
        // Show custom story button if it was hidden
        const customBtn = document.getElementById('custom-story-btn');
        if (customBtn) {
            customBtn.style.display = 'inline-flex';
            customBtn.href = `#${storyId}`;
            customBtn.setAttribute('data-story', storyId);
        }
    }
}

// Initialize the renderer when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.githubIssueRenderer = new StaticGitHubIssueRenderer();
});

// Add keyboard shortcuts (GitHub-style)
document.addEventListener('keydown', (event) => {
    // Don't trigger shortcuts if user is typing in an input/textarea
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.isContentEditable) {
        return;
    }
    
    // Theme toggle: Cmd/Ctrl + Shift + D
    if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key === 'D') {
        event.preventDefault();
        window.githubIssueRenderer?.toggleTheme();
        showShortcutFeedback('Theme toggled');
    }
    
    // GitHub-style shortcuts (single keys)
    switch(event.key.toLowerCase()) {
        case 't':
            // File finder (show tooltip instead since we can't navigate)
            event.preventDefault();
            showShortcutFeedback('File finder (t) - Feature not available in story mode');
            break;
        case 's':
            // Focus search (show tooltip)
            event.preventDefault();
            showShortcutFeedback('Search (s) - Feature not available in story mode');
            break;
        case 'g':
            // Go to shortcuts (show help)
            event.preventDefault();
            showShortcutFeedback('Press g again for navigation shortcuts');
            setTimeout(() => {
                document.addEventListener('keydown', handleGoShortcuts, { once: true });
            }, 100);
            break;
        case '?':
            // Keyboard shortcuts help
            event.preventDefault();
            showKeyboardHelp();
            break;
        case 'escape':
            // Close any open modals/tooltips
            hideShortcutFeedback();
            hideKeyboardHelp();
            break;
    }
    
    // Story navigation: Cmd/Ctrl + 1, 2, etc.
    if ((event.metaKey || event.ctrlKey) && event.key >= '1' && event.key <= '9') {
        const storyIndex = parseInt(event.key) - 1;
        const stories = Object.keys(window.SPOOKY_STORIES || {});
        if (stories[storyIndex]) {
            event.preventDefault();
            window.location.hash = stories[storyIndex];
        }
    }
});

// Handle "g" shortcuts (second key press)
function handleGoShortcuts(event) {
    switch(event.key.toLowerCase()) {
        case 'i':
            event.preventDefault();
            showShortcutFeedback('Go to Issues (g i) - Already viewing issues');
            break;
        case 'c':
            event.preventDefault();
            showShortcutFeedback('Go to Code (g c) - Feature not available in story mode');
            break;
        case 'p':
            event.preventDefault();
            showShortcutFeedback('Go to Pull Requests (g p) - Feature not available in story mode');
            break;
        case 'h':
            event.preventDefault();
            showShortcutFeedback('Go to Homepage (g h) - Feature not available in story mode');
            break;
    }
}

// Show shortcut feedback tooltip
function showShortcutFeedback(message) {
    const existing = document.getElementById('shortcut-feedback');
    if (existing) existing.remove();
    
    const tooltip = document.createElement('div');
    tooltip.id = 'shortcut-feedback';
    tooltip.textContent = message;
    tooltip.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--color-canvas-overlay);
        border: 1px solid var(--color-border-default);
        border-radius: var(--borderRadius-medium);
        padding: 8px 12px;
        font-size: 12px;
        color: var(--color-fg-default);
        z-index: 1000;
        box-shadow: var(--color-shadow-medium);
        animation: slideInFromRight 0.2s ease;
    `;
    
    document.body.appendChild(tooltip);
    setTimeout(() => tooltip.remove(), 2000);
}

function hideShortcutFeedback() {
    const existing = document.getElementById('shortcut-feedback');
    if (existing) existing.remove();
}

// Keyboard shortcuts help modal
function showKeyboardHelp() {
    const existing = document.getElementById('keyboard-help-modal');
    if (existing) return;
    
    const modal = document.createElement('div');
    modal.id = 'keyboard-help-modal';
    modal.innerHTML = `
        <div class="modal-backdrop">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Keyboard shortcuts</h3>
                    <button class="modal-close" onclick="hideKeyboardHelp()">×</button>
                </div>
                <div class="modal-body">
                    <div class="shortcut-group">
                        <h4>Site-wide shortcuts</h4>
                        <div class="shortcut-item">
                            <kbd>s</kbd> <span>Focus search</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>t</kbd> <span>File finder</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>D</kbd> <span>Toggle theme</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>?</kbd> <span>Show keyboard shortcuts</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Escape</kbd> <span>Close dialog</span>
                        </div>
                    </div>
                    <div class="shortcut-group">
                        <h4>Go to</h4>
                        <div class="shortcut-item">
                            <kbd>g</kbd> <kbd>c</kbd> <span>Go to Code</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>g</kbd> <kbd>i</kbd> <span>Go to Issues</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>g</kbd> <kbd>p</kbd> <span>Go to Pull requests</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>g</kbd> <kbd>h</kbd> <span>Go to Homepage</span>
                        </div>
                    </div>
                    <div class="shortcut-note">
                        <p><em>Note: This is a spooky story simulation. Some shortcuts show notifications instead of navigating.</em></p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function hideKeyboardHelp() {
    const modal = document.getElementById('keyboard-help-modal');
    if (modal) modal.remove();
}

// Export for external use
window.StaticGitHubIssueRenderer = StaticGitHubIssueRenderer;