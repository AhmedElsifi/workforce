import 'package:flutter/material.dart';
import 'package:workforce_mobile/core/theme/app_colors.dart';
import 'package:workforce_mobile/core/utils/formatters.dart';
import 'package:workforce_mobile/core/widgets/status_pill.dart';

import '../../data/audit_log_entry.dart';

class AuditLogTile extends StatelessWidget {
  const AuditLogTile({super.key, required this.entry});

  final AuditLogEntry entry;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                StatusPill.category(entry.category),
                Text(
                  Formatters.dateTime(entry.createdAt),
                  style: const TextStyle(color: AppColors.textFaint, fontSize: 12),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(entry.description),
            const SizedBox(height: 4),
            Text(
              'By ${entry.performedByName?.isNotEmpty == true ? entry.performedByName : 'System'}',
              style: const TextStyle(color: AppColors.textMuted, fontSize: 12),
            ),
          ],
        ),
      ),
    );
  }
}
