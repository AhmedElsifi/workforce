import 'package:flutter/material.dart';
import 'package:workforce_mobile/core/widgets/app_dropdown_field.dart';
import 'package:workforce_mobile/features/departments/data/department.dart';

import '../../data/admin_employees_repository.dart';

class AdminEmployeesFilterBar extends StatefulWidget {
  const AdminEmployeesFilterBar({
    super.key,
    required this.departments,
    required this.onChanged,
  });

  final List<Department> departments;
  final ValueChanged<EmployeeFilters> onChanged;

  @override
  State<AdminEmployeesFilterBar> createState() => _AdminEmployeesFilterBarState();
}

class _AdminEmployeesFilterBarState extends State<AdminEmployeesFilterBar> {
  String _search = '';
  String? _departmentId;
  String? _role;
  String? _status;

  void _emit() {
    widget.onChanged(EmployeeFilters(
      search: _search,
      departmentId: _departmentId,
      role: _role,
      status: _status,
    ));
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        TextField(
          onChanged: (value) {
            _search = value;
            _emit();
          },
          decoration: const InputDecoration(
            hintText: 'Search by name, email, or position',
            prefixIcon: Icon(Icons.search),
          ),
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: AppDropdownField<String?>(
                label: 'Department',
                value: _departmentId,
                items: [null, ...widget.departments.map((d) => d.id)],
                itemLabel: (id) =>
                    id == null ? 'All' : widget.departments.firstWhere((d) => d.id == id).name,
                onChanged: (value) {
                  setState(() => _departmentId = value);
                  _emit();
                },
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: AppDropdownField<String?>(
                label: 'Role',
                value: _role,
                items: const [null, 'employee', 'manager', 'admin'],
                itemLabel: (r) => r == null ? 'All' : r[0].toUpperCase() + r.substring(1),
                onChanged: (value) {
                  setState(() => _role = value);
                  _emit();
                },
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        AppDropdownField<String?>(
          label: 'Status',
          value: _status,
          items: const [null, 'active', 'inactive'],
          itemLabel: (s) => s == null ? 'All' : (s == 'active' ? 'Active' : 'Inactive'),
          onChanged: (value) {
            setState(() => _status = value);
            _emit();
          },
        ),
      ],
    );
  }
}
