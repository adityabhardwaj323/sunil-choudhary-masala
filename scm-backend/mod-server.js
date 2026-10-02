const fs = require('fs');
const serverJs = fs.readFileSync('server.js', 'utf8');
const modified = serverJs.replace(
  "app.use('/api/blog', require('./routes/blogRoutes'));",
  "app.use('/api/blog', (req, res, next) => { console.log('--- BLOG REQUEST ---'); console.log(req.method, req.url); console.log(req.headers); next(); }, require('./routes/blogRoutes'));"
);
fs.writeFileSync('server.js', modified);
