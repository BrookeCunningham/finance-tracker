// need to import jsw library to verify the token
const jwt = require('jsonwebtoken');

// authenticates a token
function authenticateToken(req, res, next) {
  // extract the token from the request header
  const authHeader = req.headers['authorization'];
  // authHeader: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  const token = authHeader && authHeader.split(' ')[1];
  // becomes false immediately if authHeader is undefined
  // if not becomes the token
  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  // verify the token using the secret key
  // did this come from my server?
  // is it expired?
  // has it been changed
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    // in message set a object user containing the token data
    req.user = decoded;
    next();
  });
}

// export the function to be used in other files
module.exports = authenticateToken