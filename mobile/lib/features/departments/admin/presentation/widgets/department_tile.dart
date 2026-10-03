import 'package:flutter/material.dart';
import 'package:workforce_mobile/core/theme/app_colors.dart';

import '../../../data/department.dart';

class DepartmentTile extends StatelessWidget {
  const DepartmentTile({
    super.key,
    required this.department,
    required this.onEdit,
    required this.onDelete,
  });

  final Department department;
  final VoidCallback onEdit;
  final VoidCallback onDelete;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(department.name, style: const TextStyle(fontWeight: FontWeight.w700)),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppColors.neutralBg,
                          borderRadius: BorderRadius.circular(999),
                        ),
                        child: Text(
                          '${department.headcount} employees',
                          style: const TextStyle(color: AppColors.neutral, fontSize: 12, fontWeight: FontWeight.w600),
                        ),
                      ),
                    ],
                  ),
                  if (department.description != null && department.description!.isNotEmpty) ...[
                    const SizedBox(height: 4),
                    Text(department.description!, style: const TextStyle(color: AppColors.textMuted)),
                  ],
                  const SizedBox(height: 4),
                  Text(
                    'Manager: ${department.managerName?.isNotEmpty == true ? department.managerName : '—'}',
                    style: const TextStyle(color: AppColors.textMuted, fontSize: 12),
                  ),
                ],
              ),
            ),
            IconButton(icon: const Icon(Icons.edit_outlined), onPressed: onEdit),
            IconButton(
              icon: const Icon(Icons.delete_outline, color: AppColors.danger),
              onPressed: onDelete,
            ),
          ],
        ),
      ),
    );
  }
}
