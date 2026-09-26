import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:workforce_mobile/core/widgets/confirm_dialog.dart';
import 'package:workforce_mobile/core/widgets/page_header.dart';
import 'package:workforce_mobile/core/widgets/resource_view.dart';

import '../../../data/department.dart';
import '../../cubit/admin_departments_cubit.dart';
import '../../cubit/admin_departments_state.dart';
import '../widgets/department_form_sheet.dart';
import '../widgets/department_tile.dart';

class AdminDepartmentsScreen extends StatefulWidget {
  const AdminDepartmentsScreen({super.key});

  @override
  State<AdminDepartmentsScreen> createState() => _AdminDepartmentsScreenState();
}

class _AdminDepartmentsScreenState extends State<AdminDepartmentsScreen> {
  @override
  void initState() {
    super.initState();
    context.read<AdminDepartmentsCubit>().loadInitial();
  }

  Future<void> _onDelete(Department department) async {
    final confirmed = await showConfirmDialog(
      context,
      title: 'Delete department',
      message: 'Are you sure you want to delete "${department.name}"? This cannot be undone.',
      confirmLabel: 'Delete',
      danger: true,
    );
    if (!confirmed || !mounted) return;
    final error = await context.read<AdminDepartmentsCubit>().delete(department.id);
    if (error != null && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(error)));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: Builder(
        builder: (context) => FloatingActionButton.extended(
          onPressed: () => showDepartmentFormSheet(
            context,
            managers: context.read<AdminDepartmentsCubit>().state.managers,
          ),
          icon: const Icon(Icons.add),
          label: const Text('Add Department'),
        ),
      ),
      body: BlocBuilder<AdminDepartmentsCubit, AdminDepartmentsState>(
        builder: (context, state) {
          return RefreshIndicator(
            onRefresh: () => context.read<AdminDepartmentsCubit>().load(),
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 96),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const PageHeader(eyebrow: 'Org Controls', title: 'Departments'),
                  const SizedBox(height: 16),
                  ResourceView<List<Department>>(
                    resource: state.departments,
                    emptyMessage: "No departments yet. Tap 'Add Department' to create the first one.",
                    emptyIcon: Icons.domain_disabled_outlined,
                    onRetry: () => context.read<AdminDepartmentsCubit>().load(),
                    isEmpty: (data) => data.isEmpty,
                    builder: (context, departments) => Column(
                      children: departments
                          .map((d) => DepartmentTile(
                                department: d,
                                onEdit: () => showDepartmentFormSheet(
                                  context,
                                  existing: d,
                                  managers: state.managers,
                                ),
                                onDelete: () => _onDelete(d),
                              ))
                          .toList(),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
