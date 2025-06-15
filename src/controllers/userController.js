import User from '../models/User.js';

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const allowedFields = [
      'name',
      'email',
      'contact',
      'representativeName',
      'representativeContact',
      'gstNumber',
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
};
