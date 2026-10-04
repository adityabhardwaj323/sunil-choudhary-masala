// @route   POST /api/auth/google
// @desc    Login or Register using Google account
// NOTE: requires frontend to send Google ID token after Google Sign-In popup
const googleAuth = async (req, res) => {
  try {
    const { googleId, email, firstName, lastName } = req.body;
    // In production, verify googleId token using google-auth-library here

    // Only include conditions for fields that are actually present.
    // { email: undefined } gets silently dropped from a Mongo query,
    // which would turn `$or: [{googleId}, {}]` into a match-everything
    // condition (an empty {} matches every document) â€” so findOne would
    // return an arbitrary, unrelated user instead of null.
    const dupConditions = [];
    if (googleId) dupConditions.push({ googleId });
    if (email) dupConditions.push({ email: email.toLowerCase() });
    let user = dupConditions.length ? await User.findOne({ $or: dupConditions }) : null;

    if (!user) {
      user = await User.create({ googleId, email, firstName, lastName });
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
