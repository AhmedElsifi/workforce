import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:workforce_mobile/core/session/auth_cubit.dart';
import 'package:workforce_mobile/core/utils/resource.dart';
import 'package:workforce_mobile/core/widgets/page_header.dart';
import 'package:workforce_mobile/core/widgets/resource_view.dart';
import 'package:workforce_mobile/features/dashboard/employee/cubit/employee_dashboard_cubit.dart';
import 'package:workforce_mobile/features/dashboard/employee/data/employee_dashboard_stats.dart';
import 'package:workforce_mobile/features/dashboard/employee/presentation/widgets/employee_stats_grid.dart';

class EmployeeDashboardScreen extends StatefulWidget {
  const EmployeeDashboardScreen({super.key});

  @override
  State<EmployeeDashboardScreen> createState() => _EmployeeDashboardScreenState();
}

class _EmployeeDashboardScreenState extends State<EmployeeDashboardScreen> {
  @override
  void initState() {
    super.initState();
    context.read<EmployeeDashboardCubit>().load();
  }

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthCubit>().state.user;

    return RefreshIndicator(
      onRefresh: () => context.read<EmployeeDashboardCubit>().load(),
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            PageHeader(
              eyebrow: 'Overview',
              title: 'Employee Dashboard',
              subtitle: 'Welcome back, ${user?.fname ?? ''}',
            ),
            const SizedBox(height: 20),
            BlocBuilder<EmployeeDashboardCubit, Resource<EmployeeDashboardStats>>(
              builder: (context, resource) {
                return ResourceView(
                  resource: resource,
                  onRetry: () => context.read<EmployeeDashboardCubit>().load(),
                  builder: (context, stats) => EmployeeStatsGrid(stats: stats),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
