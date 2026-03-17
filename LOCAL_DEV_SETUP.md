# Local Development Setup — bryceag11.github.io

## Quick Reference

| Method | Command | URL |
|--------|---------|-----|
| Native Ruby | `bundle exec jekyll serve -l -H localhost` | http://localhost:4000 |
| Docker | `docker compose up` | http://localhost:4000 |
| VS Code DevContainer | Open folder → "Reopen in Container" | http://localhost:4000 |

---

## Option 1: Native Ruby (Recommended for Flight / Offline)

### Prerequisites

```bash
# Install Ruby, ruby-dev, and build tools
sudo apt-get install -y ruby ruby-dev build-essential

# Verify
ruby --version   # needs ~3.x
```

### Install Dependencies

```bash
cd ~/bryceag11.github.io

# Install bundler (if not present)
gem install bundler --user-install

# Make sure user gem bin is on PATH (add to ~/.bashrc to persist)
export PATH="$HOME/.local/share/gem/ruby/3.2.0/bin:$PATH"

# Install gems locally to the project (one-time setup)
bundle config set --local path 'vendor/bundle'
bundle install
```

> **Troubleshooting:** If `bundle install` fails with "can't find header files for ruby", you're missing `ruby-dev`:
> ```bash
> sudo apt-get install -y ruby-dev
> ```

### Serve Locally

```bash
bundle exec jekyll serve -l -H localhost
```

- `-l` enables live reload (auto-refreshes browser on file changes)
- `-H localhost` binds to localhost only
- Site is at **http://localhost:4000**
- Press `Ctrl+C` to stop

### Build Without Serving

```bash
bundle exec jekyll build
```

Output goes to `_site/` (gitignored).

---

## Option 2: Docker

### Prerequisites

- Docker and Docker Compose installed

### Run

```bash
cd ~/bryceag11.github.io
docker compose up
```

That's it. Site is at **http://localhost:4000** with live reload.

To rebuild the image after Gemfile changes:

```bash
docker compose up --build
```

---

## Option 3: VS Code DevContainer

1. Install the **Dev Containers** extension in VS Code
2. Open `~/bryceag11.github.io` in VS Code
3. Click the popup "Reopen in Container" (or Cmd/Ctrl+Shift+P → "Dev Containers: Reopen in Container")
4. Jekyll auto-starts — visit **http://localhost:4000**

---

## Common Workflows

### Writing/Editing Content

| Content Type | Where to Edit |
|-------------|---------------|
| Blog posts | `_posts/YYYY-MM-DD-title.md` |
| Pages | `_pages/` (about, cv, etc.) |
| Publications | `_publications/` |
| Teaching | `_teaching/` |
| Talks | `_talks/` |
| Portfolio | `_portfolio/` |
| Navigation | `_data/navigation.yml` |
| CV data | `_data/cv.json` |
| Site config | `_config.yml` |

### Creating a New Blog Post

```bash
# Create a new post file
touch _posts/2026-03-12-my-new-post.md
```

Add frontmatter at the top:

```yaml
---
title: 'My New Post'
date: 2026-03-12
permalink: /posts/2026/03/my-new-post/
tags:
  - research
  - math
---

Your content here in Markdown.
```

### Important Notes

- **`_config.yml` changes require a server restart** — Jekyll doesn't live-reload config changes.
- The `vendor/` directory is gitignored — each machine installs its own gems.
- `Gemfile.lock` is also gitignored in this project.
- Photography images go in `photography/` and are indexed via `_data/photography.yml`.

### Pushing Changes

```bash
git add -A
git commit -m "Update site content"
git push origin master
```

GitHub Pages will auto-build and deploy from the `master` branch.
