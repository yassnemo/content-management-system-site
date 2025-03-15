// Markdown to HTML converter 
const fs = require('fs');
const path = require('path');
const marked = require('marked'); 
const frontMatter = require('front-matter'); 

// Configuration
const POSTS_DIR = './posts'; // for the markdown files
const OUTPUT_DIR = './blogs'; // for the outputed HTML files

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Post template
function createPostHTML(post) {
  return `
    <div id="${post.id}" class="post-page" style="display: none;">
        <div class="post-header">
            <img src="${post.image}" alt="${post.title} Header Image">
            <div class="post-title-overlay">
                <h3 class="post-title">${post.title}</h3>
                <div class="post-meta">
                    <span class="post-date">${post.date}</span>
                    <span class="post-author">By ${post.author}</span>
                </div>
            </div>
        </div>
        <div class="post-content">
            ${post.content}
        </div>
    </div>`;
}

// Blog item template for homepage
function createBlogItemHTML(post) {
  return `
    <div class="blog-item">
        <a href="javascript:showPost('${post.id}')" class="blog-image">
            <img src="${post.image}" alt="${post.title}">
        </a>
        <h2 class="blog-title">${post.title}</h2>
        <div class="blog-content">
            <div class="blog-date">${post.date}</div>
            <a href="javascript:showPost('${post.id}')" class="read-more">Read More »</a>
        </div>
    </div>`;
}

// Process all markdown files in the posts directory
function processMarkdownFiles() {
  // Read all files in the posts directory
  const files = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.md'));
  
  let blogItems = [];
  let postPages = [];

  files.forEach(file => {
    const filePath = path.join(POSTS_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse front matter and markdown content
    const parsedContent = frontMatter(fileContent);
    const metadata = parsedContent.attributes;
    const htmlContent = marked.parse(parsedContent.body);
    
    // Create post object
    const post = {
      id: file.replace('.md', ''),
      title: metadata.title || 'Untitled Post',
      date: metadata.date || new Date().toLocaleDateString(),
      author: metadata.author || 'Admin',
      image: metadata.image || '/images/default-post.jpg',
      content: htmlContent
    };
    
    // Add to blog items and post pages
    blogItems.push(createBlogItemHTML(post));
    postPages.push(createPostHTML(post));
  });
  
  // Read the index.html template
  const indexTemplate = fs.readFileSync('./templates/index-template.html', 'utf8');
  
  // Replace placeholders with actual content
  const updatedIndex = indexTemplate
    .replace('<!-- BLOG_ITEMS -->', blogItems.join('\n'))
    .replace('<!-- POST_PAGES -->', postPages.join('\n'));
  
  // Write the updated index.html
  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), updatedIndex);
  
  console.log(`Processed ${files.length} markdown files and generated index.html`);
}

// Run the processor
processMarkdownFiles();