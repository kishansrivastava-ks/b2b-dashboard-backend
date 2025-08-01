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

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');

    if (!users || users.length === 0) {
      res.status(404).json({ message: 'No users found' });
    }

    res.status(200).json({
      message: 'Users retrieved successfully',
      users,
    });
  } catch (error) {
    console.error('Error while fetching users:', error);
    res.status(500).json({
      message: 'Server failed while fetching users',
      error,
    });
  }
};
