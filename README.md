# 🎃 Spooky GitHub Issues

A Halloween-themed template that renders JSON data as authentic-looking GitHub issues for sharing scary programming stories.

## 🚀 Quick Start

```bash
# Install dependencies and start server
make dev

# Open in browser
make open

# View the UUID horror story
make uuid
```

## 📁 Project Structure

```
spooky/
├── index.html           # Main HTML template
├── styles.css           # GitHub Primer-inspired CSS
├── app.js              # JavaScript renderer
├── issue-schema.json   # JSON schema for issue data
├── sample-issue.json   # Midnight coding horror story
├── uuid-issue.json     # UUID package mystery story
├── server.py           # Development server
├── pyproject.toml      # Python dependencies
├── Makefile           # Development commands
└── README.md          # This file
```

## 🎭 Features

- **Authentic GitHub styling** using Primer design system
- **Complete issue structure** with reactions, comments, labels
- **Light/dark theme support** (Cmd/Ctrl+Shift+D to toggle)
- **Markdown rendering** for issue bodies and comments
- **Mobile responsive** design
- **CORS-friendly** works with `file://` and web servers
- **JSON Schema validation** for consistent data structure

## 📖 Usage

### View Stories

- **Default:** Midnight coding horror (`http://localhost:8000`)
- **UUID Mystery:** Impossible npm package (`http://localhost:8000?issue=uuid-issue.json`)

### Create New Stories

1. Create a JSON file following `issue-schema.json` structure
2. Load it with `?issue=your-file.json`
3. Validate with `make validate`

### Development Commands

```bash
make help       # Show all available commands
make dev        # Start development server
make validate   # Check JSON files
make test       # Run all tests
make clean      # Clean up temporary files
make status     # Show project information
```

## 🎨 Customization

### JSON Structure

Follow the schema in `issue-schema.json`:

```json
{
  "number": 1337,
  "title": "Your spooky title",
  "state": "open",
  "author": {
    "username": "ghost_coder",
    "avatar_url": "https://avatars.githubusercontent.com/u/123?v=4"
  },
  "body": "## Your story in Markdown...",
  "reactions": {"+1": 5, "eyes": 23},
  "comments": [...]
}
```

### Styling

- Edit `styles.css` to modify appearance
- Uses GitHub Primer color variables
- Support for custom label colors
- Dark/light theme automatic switching

### Adding Corruption Effects

For Halloween atmosphere, consider adding:

- CSS animations for flickering text
- Random character substitution
- Glitch effects on images
- Spooky sound effects

## 🔧 Technical Details

### Server Features

- **ASGI-based** using uvicorn for performance
- **CORS headers** for cross-origin requests
- **Proper MIME types** for all file extensions
- **Security checks** prevent directory traversal
- **Auto-reload** during development

### Browser Compatibility

- **Modern browsers** (Chrome, Firefox, Safari, Edge)
- **Fallback support** for older JavaScript
- **Progressive enhancement** for better UX
- **Mobile-first** responsive design

### Performance

- **Minimal dependencies** (just marked.js for Markdown)
- **Efficient rendering** with vanilla JavaScript
- **Cached assets** with proper headers
- **Lightweight** CSS using custom properties

## 🎪 Examples

### Creating a New Horror Story

```json
{
  "number": 404,
  "title": "Server returns 404 for pages that exist",
  "state": "open",
  "body": "Every request to `/home` returns 404, but the file is there...",
  "labels": [
    {"name": "haunted", "color": "000000"},
    {"name": "impossible", "color": "8B0000"}
  ],
  "reactions": {"confused": 42, "eyes": 156}
}
```

### Spooky Label Ideas

- `haunted` (black)
- `cursed` (dark purple)
- `midnight-only` (black)
- `impossible` (dark red)
- `eldritch` (deep green)
- `anomaly` (dark blue)

## 🎃 Halloween Tips

- Use timestamps near midnight for maximum spookiness
- Include "impossible" technical details
- Reference old dates (1692, 1969, etc.)
- Add increasing reaction counts as stories progress
- Use usernames like `ghost_coder`, `system`, `unknown_user`
- Include mysterious commit messages and phantom code

## 📜 License

This is a fun Halloween project - use it to create spooky programming stories and share them with friends!

---

*"There are more things in heaven and earth, Horatio, than are dreamt of in your philosophy."* - Shakespeare

*"It's always DNS."* - Ancient DevOps Proverb