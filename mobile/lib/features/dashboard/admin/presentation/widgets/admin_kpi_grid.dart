import 'package:flutter/material.dart';
import 'package:workforce_mobile/core/theme/app_colors.dart';
import 'package:workforce_mobile/core/widgets/stat_card.dart';

import '../../data/admin_dashboard_stats.dart';

class AdminKpiGrid extends StatelessWidget {
  const AdminKpiGrid({super.key, required this.stats});

  final AdminDashboardStats stats;

  @override
  Widget build(BuildContext context) {
    return StatCardGrid(cards: [
      StatCard(
        icon: Icons.groups_outlined,
        label: 'Total Employees',
        value: '${stats.totalEmployees}',
        color: AppColors.primary,
      ),
      StatCard(
        icon: Icons.check_circle_outline,
        label: 'Active',
        value: '${stats.activeEmployees}',
        color: AppColors.success,
      ),
      StatCard(
        icon: Icons.cancel_outlined,
        label: 'Inactive',
        value: '${stats.inactiveEmployees}',
        color: AppColors.danger,
      ),
      StatCard(
        icon: Icons.pending_actions_outlined,
        label: 'Pending Leave Requests',
        value: '${stats.pendingLeaveRequests}',
        color: AppColors.warning,
      ),
    ]);
  }
}
