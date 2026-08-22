const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');
code = code.replace("app.use('/api/blog', require('./routes/blogRoutes'));", "app.use('/api/blog', require('./routes/blogRoutes'));\napp.use('/api/location', require('./routes/locationRoutes'));");
fs.writeFileSync('server.js', code);
console.log('Added location routes to server.js');
