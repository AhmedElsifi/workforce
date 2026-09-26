import 'package:flutter/material.dart';
import 'package:workforce_mobile/core/theme/app_colors.dart';
import 'package:workforce_mobile/core/widgets/section_card.dart';

import '../../data/admin_dashboard_stats.dart';

class DepartmentDistributionPanel extends StatelessWidget {
  const DepartmentDistributionPanel({super.key, required this.departments});

  final List<DepartmentDistributionItem> departments;

  @override
  Widget build(BuildContext context) {
    if (departments.isEmpty) {
      return const SectionCard(
        title: 'Department Distribution',
        child: Text('No departments yet.', style: TextStyle(color: AppColors.textMuted)),
      );
    }

    final maxCount = departments.map((d) => d.employeeCount).reduce((a, b) => a > b ? a : b);

    return SectionCard(
      title: 'Department Distribution',
      child: Column(
        children: departments.map((dept) {
          final ratio = maxCount == 0 ? 0.0 : dept.employeeCount / maxCount;
          return Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(dept.name, style: const TextStyle(fontWeight: FontWeight.w600)),
                    Text('${dept.employeeCount}', style: const TextStyle(color: AppColors.textMuted)),
                  ],
                ),
                const SizedBox(height: 6),
                ClipRRect(
                  borderRadius: BorderRadius.circular(4),
                  child: LinearProgressIndicator(
                    value: ratio,
                    minHeight: 8,
                    backgroundColor: AppColors.border,
                    valueColor: const AlwaysStoppedAnimation(AppColors.primary),
                  ),
                ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }
}
