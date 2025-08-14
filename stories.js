/**
 * Story loader for static hosting
 * Loads story data from JSON files
 */

// Initialize the stories object
window.SPOOKY_STORIES = {};

// Load story data from JSON file
async function loadStoryData() {
    try {
        const response = await fetch('uuid-story.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const storyData = await response.json();
        
        // Structure the data to match the expected format
        window.SPOOKY_STORIES = {
            uuid: {
                id: 'uuid',
                name: '📦 UUID Mystery',
                description: 'npm package that rewrote itself',
                data: storyData
            }
        };
        
        // Dispatch a custom event to signal that stories are loaded
        window.dispatchEvent(new CustomEvent('storiesLoaded'));
        
    } catch (error) {
        console.error('Failed to load story data:', error);
        // Fallback to a basic error story
        window.SPOOKY_STORIES = {
            uuid: {
                id: 'uuid',
                name: '❌ Load Error',
                description: 'Failed to load story',
                data: {
                    number: 0,
                    title: 'Failed to load story',
                    state: 'open',
                    author: {
                        username: 'system',
                        avatar_url: 'https://avatars.githubusercontent.com/u/0?v=4'
                    },
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    body: `Failed to load story data: ${error.message}`,
                    labels: [],
                    assignees: [],
                    milestone: null,
                    reactions: {},
                    comments: [],
                    participants: []
                }
            }
        };
        window.dispatchEvent(new CustomEvent('storiesLoaded'));
    }
}

// Load the story data when the script loads
loadStoryData();