import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:workforce_mobile/core/widgets/app_dropdown_field.dart';
import 'package:workforce_mobile/core/widgets/app_text_field.dart';
import 'package:workforce_mobile/core/widgets/primary_button.dart';
import 'package:workforce_mobile/features/departments/data/department.dart';

import '../../cubit/admin_employees_cubit.dart';
import '../../cubit/admin_employees_state.dart';
import '../../data/admin_employee.dart';

const _roles = ['employee', 'manager', 'admin'];
const _statuses = ['active', 'inactive'];

Future<void> showEditEmployeeSheet(
  BuildContext context,
  AdminEmployee employee,
  List<Department> departments,
) {
  return showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    builder: (sheetContext) => BlocProvider.value(
      value: context.read<AdminEmployeesCubit>(),
      child: _EditEmployeeSheetBody(employee: employee, departments: departments),
    ),
  );
}

class _EditEmployeeSheetBody extends StatefulWidget {
  const _EditEmployeeSheetBody({required this.employee, required this.departments});

  final AdminEmployee employee;
  final List<Department> departments;

  @override
  State<_EditEmployeeSheetBody> createState() => _EditEmployeeSheetBodyState();
}

class _EditEmployeeSheetBodyState extends State<_EditEmployeeSheetBody> {
  late final _position = TextEditingController(text: widget.employee.position ?? '');
  late final _salary = TextEditingController(text: widget.employee.salary?.toString() ?? '');
  late String _role = widget.employee.role;
  late String _status = widget.employee.employmentStatus;
  String? _departmentId;

  @override
  void initState() {
    super.initState();
    _departmentId = widget.employee.departmentId;
  }

  Future<void> _submit() async {
    final cubit = context.read<AdminEmployeesCubit>();
    final ok = await cubit.updateEmployee(
      widget.employee.id,
      position: _position.text.trim(),
      role: _role,
      departmentId: _departmentId,
      salary: double.tryParse(_salary.text),
      employmentStatus: _status,
    );
    if (ok && mounted) Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        left: 16,
        right: 16,
        top: 16,
        bottom: MediaQuery.of(context).viewInsets.bottom + 16,
      ),
      child: BlocBuilder<AdminEmployeesCubit, AdminEmployeesState>(
        builder: (context, state) {
          return SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text('Edit ${widget.employee.fullName}',
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
                const SizedBox(height: 16),
                AppTextField(label: 'Position', controller: _position),
                const SizedBox(height: 12),
                AppDropdownField<String>(
                  label: 'Role',
                  value: _role,
                  items: _roles,
                  itemLabel: (r) => r[0].toUpperCase() + r.substring(1),
                  onChanged: (value) => setState(() => _role = value ?? _role),
                ),
                const SizedBox(height: 12),
                AppDropdownField<String?>(
                  label: 'Department',
                  value: _departmentId,
                  items: [null, ...widget.departments.map((d) => d.id)],
                  itemLabel: (id) =>
                      id == null ? 'No department' : widget.departments.firstWhere((d) => d.id == id).name,
                  onChanged: (value) => setState(() => _departmentId = value),
                ),
                const SizedBox(height: 12),
                AppTextField(
                  label: 'Salary',
                  controller: _salary,
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                ),
                const SizedBox(height: 12),
                AppDropdownField<String>(
                  label: 'Employment Status',
                  value: _status,
                  items: _statuses,
                  itemLabel: (s) => s == 'active' ? 'Active' : 'Inactive',
                  onChanged: (value) => setState(() => _status = value ?? _status),
                ),
                const SizedBox(height: 20),
                PrimaryButton(label: 'Save Changes', loading: state.isSubmitting, onPressed: _submit),
              ],
            ),
          );
        },
      ),
    );
  }
}
