import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:workforce_mobile/core/utils/resource.dart';
import 'package:workforce_mobile/core/widgets/page_header.dart';
import 'package:workforce_mobile/core/widgets/resource_view.dart';

import '../../cubit/manager_dashboard_cubit.dart';
import '../../data/manager_dashboard_stats.dart';
import '../widgets/attendance_overview_card.dart';
import '../widgets/manager_kpi_grid.dart';
import '../widgets/manager_quick_actions.dart';

class ManagerDashboardScreen extends StatefulWidget {
  const ManagerDashboardScreen({super.key});

  @override
  State<ManagerDashboardScreen> createState() => _ManagerDashboardScreenState();
}

class _ManagerDashboardScreenState extends State<ManagerDashboardScreen> {
  @override
  void initState() {
    super.initState();
    context.read<ManagerDashboardCubit>().load();
  }

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: () => context.read<ManagerDashboardCubit>().load(),
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(16),
        child: BlocBuilder<ManagerDashboardCubit, Resource<ManagerDashboardStats>>(
          builder: (context, resource) {
            return ResourceView(
              resource: resource,
              onRetry: () => context.read<ManagerDashboardCubit>().load(),
              builder: (context, stats) => Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  PageHeader(
                    eyebrow: 'Overview',
                    title: 'Manager Dashboard',
                    subtitle: 'Overview of the ${stats.departmentName} department',
                  ),
                  const SizedBox(height: 20),
                  ManagerKpiGrid(stats: stats),
                  const SizedBox(height: 16),
                  AttendanceOverviewCard(
                    presentToday: stats.presentToday,
                    absentToday: stats.absentToday,
                    clockInRate: stats.clockInRate,
                  ),
                  const SizedBox(height: 16),
                  const ManagerQuickActions(),
                ],
              ),
            );
          },
        ),
      ),
    );
  }
}
