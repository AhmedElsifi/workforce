import 'package:flutter/material.dart';

import 'package:workforce_mobile/core/theme/app_colors.dart';

/// Icon-chip + label + value card used on every dashboard's KPI grid.
class StatCard extends StatelessWidget {
  const StatCard({
    super.key,
    required this.icon,
    required this.label,
    required this.value,
    required this.color,
    this.hint,
  });

  final IconData icon;
  final String label;
  final String value;
  final Color color;
  final String? hint;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: color, size: 22),
          ),
          const SizedBox(height: 12),
          Text(
            label,
            style: const TextStyle(color: AppColors.textMuted, fontSize: 12, fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: const TextStyle(
              color: AppColors.textPrimary,
              fontSize: 24,
              fontWeight: FontWeight.w700,
            ),
          ),
          if (hint != null) ...[
            const SizedBox(height: 4),
            Text(hint!, style: const TextStyle(color: AppColors.textFaint, fontSize: 11)),
          ],
        ],
      ),
    );
  }
}

/// Responsive grid: 2 columns on phones, more on wider screens, matching the
/// web's `.stats-grid` reflow.
class StatCardGrid extends StatelessWidget {
  const StatCardGrid({super.key, required this.cards});

  final List<StatCard> cards;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final columns = constraints.maxWidth >= 900
            ? 4
            : constraints.maxWidth >= 600
                ? 3
                : 2;
        return GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: cards.length,
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: columns,
            mainAxisSpacing: 12,
            crossAxisSpacing: 12,
            // Tall enough to comfortably fit the icon+label+value(+hint)
            // column across device font-scale settings without overflowing.
            childAspectRatio: 0.95,
          ),
          itemBuilder: (context, index) => cards[index],
        );
      },
    );
  }
}
