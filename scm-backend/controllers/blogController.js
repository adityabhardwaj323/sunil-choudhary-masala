const Blog = require('../models/Blog');
const { checkMediaLimits } = require('../utils/mediaLimits');
const { uploadCmsImage, deleteCmsImage } = require('../utils/cloudinaryCms');

const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'published' }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch blogs', error: error.message });
  }
};

const getAdminBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch blogs', error: error.message });
  }
};

const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch blog', error: error.message });
  }
};

const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    if (blog.status !== 'published') return res.status(403).json({ message: 'Blog is not published' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch blog', error: error.message });
  }
};

const createBlog = async (req, res) => {
  try {
    const { title, content, status, slug, excerpt, author, category, publishedAt } = req.body;
    let { tags } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    if (tags) {
      try {
        tags = JSON.parse(tags);
      } catch(e) {
        // If not valid JSON, assume it's an array or ignore
      }
    }

    // Basic slug fallback
    const finalSlug = slug ? slug.toLowerCase().replace(/[^a-z0-9]+/g, '-') : title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    // Check if slug exists
    const existing = await Blog.findOne({ slug: finalSlug });
    if (existing) {
      return res.status(400).json({ message: 'Slug already exists' });
    }

    let featuredImageUrl = null;
    let featuredImagePublicId = null;

    if (req.file) {
      await checkMediaLimits('blog');
      const result = await uploadCmsImage(req.file.buffer, req.file.mimetype, 'scm-blog');
      featuredImageUrl = result.secure_url;
      featuredImagePublicId = result.public_id;
    }

    const blog = await Blog.create({
      title,
      slug: finalSlug,
      content,
      excerpt,
      author: author || 'Admin',
      category: category || 'Uncategorized',
      tags: tags || [],
      publishedAt: publishedAt || Date.now(),
      status: status || 'published',
      featuredImageUrl,
      featuredImagePublicId
    });

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    let newImageUrl = blog.featuredImageUrl;
    let newPublicId = blog.featuredImagePublicId;
    let oldPublicId = null;

    if (req.file) {
      if (!blog.featuredImageUrl) {
        await checkMediaLimits('blog');
      }
      const result = await uploadCmsImage(req.file.buffer, req.file.mimetype, 'scm-blog');
      newImageUrl = result.secure_url;
      newPublicId = result.public_id;
      oldPublicId = blog.featuredImagePublicId;
    }

    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;
    if (req.body.status) blog.status = req.body.status;
    
    if (req.body.slug && req.body.slug !== blog.slug) {
      const finalSlug = req.body.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const existing = await Blog.findOne({ slug: finalSlug });
      if (existing) {
        return res.status(400).json({ message: 'Slug already exists' });
      }
      blog.slug = finalSlug;
    }
    
    if (req.body.excerpt !== undefined) blog.excerpt = req.body.excerpt;
    if (req.body.author !== undefined) blog.author = req.body.author;
    if (req.body.category !== undefined) blog.category = req.body.category;
    if (req.body.publishedAt !== undefined) blog.publishedAt = req.body.publishedAt;
    
    if (req.body.tags) {
      try {
        blog.tags = JSON.parse(req.body.tags);
      } catch(e) {}
    }

    blog.featuredImageUrl = newImageUrl;
    blog.featuredImagePublicId = newPublicId;

    await blog.save();

    if (oldPublicId && oldPublicId !== newPublicId) {
      await deleteCmsImage(oldPublicId);
    }

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const publicId = blog.featuredImagePublicId;
    await blog.deleteOne();

    if (publicId) {
      await deleteCmsImage(publicId);
    }

    res.json({ message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBlogs, getAdminBlogs, getBlogById, getBlogBySlug, createBlog, updateBlog, deleteBlog };
