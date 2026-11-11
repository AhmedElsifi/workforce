import 'package:flutter/material.dart';

import 'package:workforce_mobile/core/theme/app_colors.dart';

/// Mirrors the web client's `.page-header` (eyebrow + title + subtitle),
/// reused at the top of every screen.
class PageHeader extends StatelessWidget {
  const PageHeader({super.key, required this.eyebrow, required this.title, this.subtitle, this.action});

  final String eyebrow;
  final String title;
  final String? subtitle;
  final Widget? action;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                eyebrow.toUpperCase(),
                style: const TextStyle(
                  color: AppColors.textMuted,
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.8,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                title,
                style: const TextStyle(
                  color: AppColors.textPrimary,
                  fontSize: 22,
                  fontWeight: FontWeight.w700,
                ),
              ),
              if (subtitle != null) ...[
                const SizedBox(height: 4),
                Text(subtitle!, style: const TextStyle(color: AppColors.textMuted, fontSize: 13)),
              ],
            ],
          ),
        ),
        ?action,
      ],
    );
  }
}
