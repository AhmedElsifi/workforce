import 'package:flutter/material.dart';
import 'package:workforce_mobile/core/theme/app_colors.dart';
import 'package:workforce_mobile/core/utils/formatters.dart';
import 'package:workforce_mobile/core/widgets/avatar_initials.dart';
import 'package:workforce_mobile/core/widgets/status_pill.dart';

import '../../data/admin_employee.dart';

class AdminEmployeeTile extends StatelessWidget {
  const AdminEmployeeTile({
    super.key,
    required this.employee,
    required this.onEdit,
    required this.onToggleStatus,
  });

  final AdminEmployee employee;
  final VoidCallback onEdit;
  final VoidCallback onToggleStatus;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            AvatarInitials(initials: Formatters.initialsOf(employee.fname, employee.lname)),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(Formatters.titleCase(employee.fullName), style: const TextStyle(fontWeight: FontWeight.w700)),
                  Text(employee.email, style: const TextStyle(color: AppColors.textMuted, fontSize: 12)),
                  Text(
                    '${employee.position ?? '—'} · ${employee.departmentName ?? '—'} · ${employee.role}',
                    style: const TextStyle(color: AppColors.textMuted, fontSize: 12),
                  ),
                  const SizedBox(height: 6),
                  StatusPill.employmentStatus(employee.employmentStatus),
                ],
              ),
            ),
            Column(
              children: [
                IconButton(icon: const Icon(Icons.edit_outlined), onPressed: onEdit),
                IconButton(
                  icon: Icon(
                    employee.isActive ? Icons.person_remove_outlined : Icons.person_add_alt_outlined,
                    color: employee.isActive ? AppColors.danger : AppColors.success,
                  ),
                  onPressed: onToggleStatus,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
