import 'package:flutter/material.dart';

import 'package:workforce_mobile/core/theme/app_colors.dart';
import 'package:workforce_mobile/core/widgets/stat_card.dart';
import 'package:workforce_mobile/features/dashboard/employee/data/employee_dashboard_stats.dart';

class EmployeeStatsGrid extends StatelessWidget {
  const EmployeeStatsGrid({super.key, required this.stats});

  final EmployeeDashboardStats stats;

  @override
  Widget build(BuildContext context) {
    return StatCardGrid(cards: [
      StatCard(
        icon: Icons.calendar_month,
        label: 'Total Attendance Days',
        value: '${stats.totalAttendanceDays}',
        color: AppColors.primary,
        hint: 'Days with a recorded check-in',
      ),
      StatCard(
        icon: Icons.task_alt,
        label: 'Completed Days',
        value: '${stats.completedAttendanceDays}',
        color: AppColors.success,
        hint: 'Checked in and checked out',
      ),
      StatCard(
        icon: Icons.pending_actions,
        label: 'Open Days',
        value: '${stats.openAttendanceDays}',
        color: AppColors.warning,
        hint: 'Awaiting a check-out',
      ),
      StatCard(
        icon: Icons.description_outlined,
        label: 'Pending Leave Requests',
        value: '${stats.pendingLeaveCount}',
        color: AppColors.neutral,
        hint: '${stats.totalLeaveRequests} submitted total',
      ),
    ]);
  }
}
