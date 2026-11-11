import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:workforce_mobile/core/widgets/confirm_dialog.dart';
import 'package:workforce_mobile/core/widgets/page_header.dart';
import 'package:workforce_mobile/core/widgets/resource_view.dart';

import '../../cubit/admin_employees_cubit.dart';
import '../../cubit/admin_employees_state.dart';
import '../../data/admin_employee.dart';
import '../widgets/add_employee_sheet.dart';
import '../widgets/admin_employee_tile.dart';
import '../widgets/admin_employees_filter_bar.dart';
import '../widgets/edit_employee_sheet.dart';

class AdminEmployeesScreen extends StatefulWidget {
  const AdminEmployeesScreen({super.key});

  @override
  State<AdminEmployeesScreen> createState() => _AdminEmployeesScreenState();
}

class _AdminEmployeesScreenState extends State<AdminEmployeesScreen> {
  @override
  void initState() {
    super.initState();
    context.read<AdminEmployeesCubit>().loadInitial();
  }

  Future<void> _onToggleStatus(AdminEmployee employee) async {
    final cubit = context.read<AdminEmployeesCubit>();
    if (employee.isActive) {
      final confirmed = await showConfirmDialog(
        context,
        title: 'Deactivate employee',
        message: 'Deactivate ${employee.fullName}?',
        confirmLabel: 'Deactivate',
        danger: true,
      );
      if (!confirmed) return;
      final error = await cubit.deactivate(employee.id);
      if (error != null && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(error)));
      }
    } else {
      final error = await cubit.reactivate(employee);
      if (error != null && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(error)));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: Builder(
        builder: (context) => FloatingActionButton.extended(
          onPressed: () => showAddEmployeeSheet(
            context,
            context.read<AdminEmployeesCubit>().state.departments,
          ),
          icon: const Icon(Icons.add),
          label: const Text('Add Employee'),
        ),
      ),
      body: BlocBuilder<AdminEmployeesCubit, AdminEmployeesState>(
        builder: (context, state) {
          return RefreshIndicator(
            onRefresh: () => context.read<AdminEmployeesCubit>().loadEmployees(),
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 96),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const PageHeader(eyebrow: 'People', title: 'Employees'),
                  const SizedBox(height: 16),
                  AdminEmployeesFilterBar(
                    departments: state.departments,
                    onChanged: (filters) => context.read<AdminEmployeesCubit>().updateFilters(filters),
                  ),
                  const SizedBox(height: 16),
                  ResourceView<List<AdminEmployee>>(
                    resource: state.employees,
                    emptyMessage: 'No employees match your filters.',
                    emptyIcon: Icons.person_off_outlined,
                    onRetry: () => context.read<AdminEmployeesCubit>().loadEmployees(),
                    isEmpty: (data) => data.isEmpty,
                    builder: (context, employees) => Column(
                      children: employees
                          .map((e) => AdminEmployeeTile(
                                employee: e,
                                onEdit: () => showEditEmployeeSheet(context, e, state.departments),
                                onToggleStatus: () => _onToggleStatus(e),
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
