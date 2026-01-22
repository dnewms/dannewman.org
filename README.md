# dan newman dot org

Personal website and blog built with Jekyll, hosted on GitHub Pages.

## Quick Start

### Option 1: GitHub Pages (Recommended)

1. Create a new repository on GitHub named `dannewman.github.io` (or any name, then configure Pages)
2. Push this entire folder to the repository
3. Go to Settings → Pages → Set source to "main" branch
4. Your site will be live at `https://yourusername.github.io`

### Option 2: Local Development

```bash
# Install Ruby and Bundler first, then:
bundle install
bundle exec jekyll serve
```

Visit `http://localhost:4000` to preview.

## Adding a New Blog Post

1. Create a new file in `_posts/` with the format: `YYYY-MM-DD-title-here.md`
2. Add front matter at the top:

```yaml
---
layout: post
title: "Your Post Title"
date: 2025-01-21
tags: [tag1, tag2]
---
```

3. Write your content in Markdown below the front matter
4. Commit and push — GitHub Pages will automatically rebuild

## File Structure

```
├── _config.yml          # Site settings
├── _layouts/            # HTML templates
│   ├── default.html     # Base layout
│   └── post.html        # Blog post layout
├── _includes/           # Reusable components
│   ├── header.html
│   └── footer.html
├── _posts/              # Blog posts (Markdown)
├── assets/
│   ├── css/style.css    # All styles
│   └── images/          # Images (put photo.jpg here)
├── blog/index.html      # Blog listing page
└── index.html           # Homepage
```

## Custom Domain Setup

1. In your GitHub repo, go to Settings → Pages
2. Under "Custom domain", enter `dannewman.org`
3. Update your DNS (at your registrar):
   - Add a CNAME record: `www` → `yourusername.github.io`
   - Add A records pointing to GitHub's IPs:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
4. Wait for DNS propagation (up to 24 hours)
5. Enable "Enforce HTTPS" in GitHub Pages settings

**Important:** Keep your Fastmail MX records intact! Only change A/CNAME records for the website.

## Migrating Old WordPress Posts

To export your old posts from WordPress:

1. In WordPress admin, go to Tools → Export
2. Select "Posts" and download the XML file
3. Use a tool like [wordpress-export-to-markdown](https://github.com/lonekorean/wordpress-export-to-markdown) to convert
4. Move the generated `.md` files to `_posts/`

## Colors & Fonts

- Blue: `rgb(43, 122, 199)`
- Orange: `rgb(255, 109, 39)`
- Display font: Space Mono (h1, h2 only)
- Body font: Lato
