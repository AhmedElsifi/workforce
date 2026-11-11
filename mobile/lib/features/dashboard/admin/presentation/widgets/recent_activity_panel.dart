import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:workforce_mobile/core/theme/app_colors.dart';
import 'package:workforce_mobile/core/utils/formatters.dart';
import 'package:workforce_mobile/core/widgets/section_card.dart';

import '../../data/admin_dashboard_stats.dart';

class RecentActivityPanel extends StatelessWidget {
  const RecentActivityPanel({super.key, required this.activity});

  final List<RecentActivityItem> activity;

  @override
  Widget build(BuildContext context) {
    return SectionCard(
      title: 'Recent Activity',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          if (activity.isEmpty)
            const Text('No recent activity yet.', style: TextStyle(color: AppColors.textMuted))
          else
            ...activity.map((item) => Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(Icons.history, size: 18, color: AppColors.textFaint),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(item.description),
                            Text(
                              Formatters.timeAgo(item.createdAt),
                              style: const TextStyle(color: AppColors.textFaint, fontSize: 12),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                )),
          const SizedBox(height: 4),
          TextButton(
            onPressed: () => context.go('/admin/audit'),
            child: const Text('View full audit log →'),
          ),
        ],
      ),
    );
  }
}
