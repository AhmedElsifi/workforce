import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:workforce_mobile/core/utils/resource.dart';
import 'package:workforce_mobile/core/widgets/page_header.dart';
import 'package:workforce_mobile/core/widgets/resource_view.dart';

import '../../cubit/admin_dashboard_cubit.dart';
import '../../data/admin_dashboard_stats.dart';
import '../widgets/admin_kpi_grid.dart';
import '../widgets/department_distribution_panel.dart';
import '../widgets/recent_activity_panel.dart';

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({super.key});

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  @override
  void initState() {
    super.initState();
    context.read<AdminDashboardCubit>().load();
  }

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: () => context.read<AdminDashboardCubit>().load(),
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(16),
        child: BlocBuilder<AdminDashboardCubit, Resource<AdminDashboardStats>>(
          builder: (context, resource) {
            return ResourceView(
              resource: resource,
              onRetry: () => context.read<AdminDashboardCubit>().load(),
              builder: (context, stats) => Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const PageHeader(eyebrow: 'Overview', title: 'Admin Dashboard'),
                  const SizedBox(height: 20),
                  AdminKpiGrid(stats: stats),
                  const SizedBox(height: 16),
                  DepartmentDistributionPanel(departments: stats.departmentDistribution),
                  const SizedBox(height: 16),
                  RecentActivityPanel(activity: stats.recentActivity),
                ],
              ),
            );
          },
        ),
      ),
    );
  }
}
