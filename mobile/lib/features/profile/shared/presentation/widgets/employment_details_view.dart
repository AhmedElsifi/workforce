import 'package:flutter/material.dart';
import 'package:workforce_mobile/core/session/current_user.dart';
import 'package:workforce_mobile/core/theme/app_colors.dart';
import 'package:workforce_mobile/core/utils/formatters.dart';
import 'package:workforce_mobile/core/widgets/section_card.dart';
import 'package:workforce_mobile/core/widgets/status_pill.dart';

/// Read-only "Managed by HR" panel shown to employees and managers, matching
/// the web client's locked employment-details grid.
class EmploymentDetailsView extends StatelessWidget {
  const EmploymentDetailsView({super.key, required this.user});

  final CurrentUser user;

  @override
  Widget build(BuildContext context) {
    return SectionCard(
      title: 'Employment Details',
      trailing: const Chip(
        label: Text('Managed by HR', style: TextStyle(fontSize: 11)),
        avatar: Icon(Icons.lock_outline, size: 14),
        visualDensity: VisualDensity.compact,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _Row('Position', Formatters.titleCase(user.position)),
          _Row('Department', user.department ?? '-'),
          _Row('Role', user.role.label),
          _Row('Salary', Formatters.currency(user.salary)),
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: Row(
              children: [
                const Text('Employment Status', style: TextStyle(color: AppColors.textMuted, fontSize: 13)),
                const Spacer(),
                StatusPill.employmentStatus(user.employmentStatus ?? 'inactive'),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _Row extends StatelessWidget {
  const _Row(this.label, this.value);

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: AppColors.textMuted, fontSize: 13)),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }
}
