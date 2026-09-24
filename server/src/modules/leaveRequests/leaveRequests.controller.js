// Create a new leave request (Employee)
exports.createLeaveRequest = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    const employeeId = req.user ? req.user.id : req.body.employeeId;

    // 1. Validation: End date must be after start date
    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    // 2. Validation: Check for overlapping leave requests
    const existingLeave = await LeaveRequest.findOne({
      employeeId,
      status: { $in: ['Pending', 'Approved'] },
      $or: [
        { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } }
      ]
    });

    if (existingLeave) {
      return res.status(400).json({ message: 'You already have a pending or approved leave request for these dates' });
    }

    const newLeave = new LeaveRequest({
      employeeId,
      leaveType,
      startDate,
      endDate,
      reason
    });

    await newLeave.save();
    res.status(201).json({ message: 'Leave request submitted successfully', leave: newLeave });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};