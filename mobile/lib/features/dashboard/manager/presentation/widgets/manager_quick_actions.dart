import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:workforce_mobile/core/theme/app_colors.dart';
import 'package:workforce_mobile/core/widgets/section_card.dart';

class ManagerQuickActions extends StatelessWidget {
  const ManagerQuickActions({super.key});

  @override
  Widget build(BuildContext context) {
    return SectionCard(
      title: 'Quick Actions',
      child: Column(
        children: [
          _ActionTile(
            icon: Icons.fact_check_outlined,
            label: 'Review Leave Requests',
            onTap: () => context.go('/manager/leave-requests'),
          ),
          _ActionTile(
            icon: Icons.group_outlined,
            label: 'View Department Roster',
            onTap: () => context.go('/manager/team'),
          ),
          _ActionTile(
            icon: Icons.schedule_outlined,
            label: 'View Attendance Logs',
            onTap: () => context.go('/manager/attendance'),
          ),
        ],
      ),
    );
  }
}

class _ActionTile extends StatelessWidget {
  const _ActionTile({required this.icon, required this.label, required this.onTap});

  final IconData icon;
  final String label;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: EdgeInsets.zero,
      leading: Icon(icon, color: AppColors.primary),
      title: Text(label),
      trailing: const Icon(Icons.chevron_right),
      onTap: onTap,
    );
  }
}
