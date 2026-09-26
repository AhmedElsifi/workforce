import 'package:flutter/material.dart';
import 'package:workforce_mobile/core/session/user_role.dart';
import 'package:workforce_mobile/core/widgets/app_dropdown_field.dart';
import 'package:workforce_mobile/core/widgets/app_text_field.dart';
import 'package:workforce_mobile/core/widgets/section_card.dart';

/// Admin-only editable employment fields, matching the web admin profile
/// page (position/role/salary/employmentStatus — an admin has no department).
class AdminEmploymentForm extends StatelessWidget {
  const AdminEmploymentForm({
    super.key,
    required this.positionController,
    required this.salaryController,
    required this.role,
    required this.employmentStatus,
    required this.onRoleChanged,
    required this.onStatusChanged,
  });

  final TextEditingController positionController;
  final TextEditingController salaryController;
  final UserRole role;
  final String employmentStatus;
  final ValueChanged<UserRole?> onRoleChanged;
  final ValueChanged<String?> onStatusChanged;

  @override
  Widget build(BuildContext context) {
    return SectionCard(
      title: 'Employment Details',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          AppTextField(label: 'Position', controller: positionController),
          const SizedBox(height: 12),
          AppDropdownField<UserRole>(
            label: 'Role',
            value: role,
            items: UserRole.values,
            itemLabel: (r) => r.label,
            onChanged: onRoleChanged,
          ),
          const SizedBox(height: 12),
          AppTextField(
            label: 'Salary',
            controller: salaryController,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
          ),
          const SizedBox(height: 12),
          AppDropdownField<String>(
            label: 'Employment Status',
            value: employmentStatus,
            items: const ['active', 'inactive'],
            itemLabel: (s) => s == 'active' ? 'Active' : 'Inactive',
            onChanged: onStatusChanged,
          ),
        ],
      ),
    );
  }
}
