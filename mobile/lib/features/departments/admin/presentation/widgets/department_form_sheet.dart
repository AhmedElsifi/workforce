import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:workforce_mobile/core/widgets/app_dropdown_field.dart';
import 'package:workforce_mobile/core/widgets/app_text_field.dart';
import 'package:workforce_mobile/core/widgets/primary_button.dart';

import '../../../data/department.dart';
import '../../cubit/admin_departments_cubit.dart';
import '../../cubit/admin_departments_state.dart';

Future<void> showDepartmentFormSheet(
  BuildContext context, {
  Department? existing,
  required List<ManagerOption> managers,
}) {
  return showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    builder: (sheetContext) => BlocProvider.value(
      value: context.read<AdminDepartmentsCubit>(),
      child: _DepartmentFormBody(existing: existing, managers: managers),
    ),
  );
}

class _DepartmentFormBody extends StatefulWidget {
  const _DepartmentFormBody({required this.existing, required this.managers});

  final Department? existing;
  final List<ManagerOption> managers;

  @override
  State<_DepartmentFormBody> createState() => _DepartmentFormBodyState();
}

class _DepartmentFormBodyState extends State<_DepartmentFormBody> {
  late final _name = TextEditingController(text: widget.existing?.name ?? '');
  late final _description = TextEditingController(text: widget.existing?.description ?? '');
  String? _managerId;

  @override
  void initState() {
    super.initState();
    _managerId = widget.existing?.managerId;
  }

  Future<void> _submit() async {
    final cubit = context.read<AdminDepartmentsCubit>();
    final ok = widget.existing == null
        ? await cubit.create(
            name: _name.text.trim(),
            description: _description.text.trim(),
            managerId: _managerId,
          )
        : await cubit.update(
            widget.existing!.id,
            name: _name.text.trim(),
            description: _description.text.trim(),
            managerId: _managerId,
          );
    if (ok && mounted) Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    final isEdit = widget.existing != null;

    return Padding(
      padding: EdgeInsets.only(
        left: 16,
        right: 16,
        top: 16,
        bottom: MediaQuery.of(context).viewInsets.bottom + 16,
      ),
      child: BlocBuilder<AdminDepartmentsCubit, AdminDepartmentsState>(
        builder: (context, state) {
          return SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text(
                  isEdit ? 'Edit Department' : 'Add Department',
                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
                ),
                const SizedBox(height: 16),
                AppTextField(
                  label: 'Name',
                  controller: _name,
                  errorText: state.formErrors['name'] as String?,
                ),
                const SizedBox(height: 12),
                AppTextField(label: 'Description', controller: _description, maxLines: 3),
                const SizedBox(height: 12),
                AppDropdownField<String?>(
                  label: 'Manager',
                  value: _managerId,
                  items: [null, ...widget.managers.map((m) => m.id)],
                  itemLabel: (id) => id == null
                      ? 'No manager assigned'
                      : widget.managers.firstWhere((m) => m.id == id).fullName,
                  errorText: state.formErrors['manager'] as String?,
                  onChanged: (value) => setState(() => _managerId = value),
                ),
                const SizedBox(height: 20),
                PrimaryButton(
                  label: isEdit ? 'Save Changes' : 'Add Department',
                  loading: state.isSubmitting,
                  onPressed: _submit,
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
