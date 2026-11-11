import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:workforce_mobile/core/widgets/app_dropdown_field.dart';
import 'package:workforce_mobile/core/widgets/app_text_field.dart';
import 'package:workforce_mobile/core/widgets/primary_button.dart';
import 'package:workforce_mobile/features/departments/data/department.dart';

import '../../cubit/admin_employees_cubit.dart';
import '../../cubit/admin_employees_state.dart';

Future<void> showAddEmployeeSheet(BuildContext context, List<Department> departments) {
  return showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    builder: (sheetContext) => BlocProvider.value(
      value: context.read<AdminEmployeesCubit>(),
      child: _AddEmployeeSheetBody(departments: departments),
    ),
  );
}

class _AddEmployeeSheetBody extends StatefulWidget {
  const _AddEmployeeSheetBody({required this.departments});

  final List<Department> departments;

  @override
  State<_AddEmployeeSheetBody> createState() => _AddEmployeeSheetBodyState();
}

class _AddEmployeeSheetBodyState extends State<_AddEmployeeSheetBody> {
  final _fname = TextEditingController();
  final _lname = TextEditingController();
  final _email = TextEditingController();
  final _password = TextEditingController();
  final _position = TextEditingController();
  final _salary = TextEditingController();
  String? _departmentId;

  Future<void> _submit() async {
    final cubit = context.read<AdminEmployeesCubit>();
    final ok = await cubit.createEmployee(
      fname: _fname.text.trim(),
      lname: _lname.text.trim(),
      email: _email.text.trim(),
      password: _password.text,
      position: _position.text.trim(),
      departmentId: _departmentId,
      salary: double.tryParse(_salary.text),
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
                const Text('Add Employee', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
                const SizedBox(height: 16),
                AppTextField(
                  label: 'First Name',
                  controller: _fname,
                  errorText: state.formErrors['fname'] as String?,
                ),
                const SizedBox(height: 12),
                AppTextField(
                  label: 'Last Name',
                  controller: _lname,
                  errorText: state.formErrors['lname'] as String?,
                ),
                const SizedBox(height: 12),
                AppTextField(
                  label: 'Email',
                  controller: _email,
                  keyboardType: TextInputType.emailAddress,
                  errorText: state.formErrors['email'] as String?,
                ),
                const SizedBox(height: 12),
                AppTextField(
                  label: 'Password',
                  controller: _password,
                  obscureText: true,
                  errorText: state.formErrors['password'] as String?,
                ),
                const SizedBox(height: 12),
                AppTextField(label: 'Position', controller: _position),
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
                const SizedBox(height: 20),
                PrimaryButton(label: 'Add Employee', loading: state.isSubmitting, onPressed: _submit),
              ],
            ),
          );
        },
      ),
    );
  }
}
