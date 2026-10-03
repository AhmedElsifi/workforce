import 'package:flutter/material.dart';
import 'package:workforce_mobile/core/theme/app_colors.dart';
import 'package:workforce_mobile/core/widgets/stat_card.dart';

import '../../data/manager_dashboard_stats.dart';

class ManagerKpiGrid extends StatelessWidget {
  const ManagerKpiGrid({super.key, required this.stats});

  final ManagerDashboardStats stats;

  @override
  Widget build(BuildContext context) {
    return StatCardGrid(cards: [
      StatCard(
        icon: Icons.groups_outlined,
        label: 'Department Staff',
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
