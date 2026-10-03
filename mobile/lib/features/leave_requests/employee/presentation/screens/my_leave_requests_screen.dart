import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:workforce_mobile/core/widgets/page_header.dart';
import 'package:workforce_mobile/core/widgets/resource_view.dart';

import '../../cubit/employee_leave_cubit.dart';
import '../../cubit/employee_leave_state.dart';
import '../widgets/leave_request_form.dart';
import '../widgets/my_leave_request_tile.dart';

class MyLeaveRequestsScreen extends StatefulWidget {
  const MyLeaveRequestsScreen({super.key});

  @override
  State<MyLeaveRequestsScreen> createState() => _MyLeaveRequestsScreenState();
}

class _MyLeaveRequestsScreenState extends State<MyLeaveRequestsScreen> {
  @override
  void initState() {
    super.initState();
    context.read<EmployeeLeaveCubit>().load();
  }

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<EmployeeLeaveCubit, EmployeeLeaveState>(
      listenWhen: (previous, current) =>
          current.submitMessage != null && current.submitMessage != previous.submitMessage,
      listener: (context, state) {
        ScaffoldMessenger.of(context)
          ..hideCurrentSnackBar()
          ..showSnackBar(SnackBar(content: Text(state.submitMessage!)));
      },
      builder: (context, state) {
        return RefreshIndicator(
          onRefresh: () => context.read<EmployeeLeaveCubit>().load(),
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const PageHeader(
                  eyebrow: 'Time Off',
                  title: 'My Leave Requests',
                  subtitle: 'Submit a new request and track your history.',
                ),
                const SizedBox(height: 20),
                LeaveRequestForm(isSubmitting: state.isSubmitting),
                const SizedBox(height: 24),
                const Text('History', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 16)),
                const SizedBox(height: 12),
                ResourceView(
                  resource: state.requests,
                  emptyMessage: 'You have no leave history.',
                  emptyIcon: Icons.description_outlined,
                  onRetry: () => context.read<EmployeeLeaveCubit>().load(),
                  isEmpty: (data) => data.isEmpty,
                  builder: (context, requests) => Column(
                    children: requests.map((r) => MyLeaveRequestTile(request: r)).toList(),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
