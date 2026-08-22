const Blog = require('../models/Blog');
const { checkMediaLimits } = require('../utils/mediaLimits');
const { uploadCmsImage, deleteCmsImage } = require('../utils/cloudinaryCms');

const getBlogs = async (req, res) => {
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

const createBlog = async (req, res) => {
  try {
    const { title, content, status } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
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
      content,
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
      // If we didn't have an image before, we must check limits
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

module.exports = { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog };
