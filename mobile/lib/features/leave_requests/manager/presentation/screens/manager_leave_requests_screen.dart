import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:workforce_mobile/core/widgets/page_header.dart';
import 'package:workforce_mobile/core/widgets/resource_view.dart';

import '../../cubit/manager_leave_cubit.dart';
import '../../cubit/manager_leave_state.dart';
import '../widgets/manager_leave_request_tile.dart';

class ManagerLeaveRequestsScreen extends StatefulWidget {
  const ManagerLeaveRequestsScreen({super.key});

  @override
  State<ManagerLeaveRequestsScreen> createState() => _ManagerLeaveRequestsScreenState();
}

class _ManagerLeaveRequestsScreenState extends State<ManagerLeaveRequestsScreen> {
  @override
  void initState() {
    super.initState();
    context.read<ManagerLeaveCubit>().load();
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ManagerLeaveCubit, ManagerLeaveState>(
      builder: (context, state) {
        return RefreshIndicator(
          onRefresh: () => context.read<ManagerLeaveCubit>().load(),
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const PageHeader(eyebrow: 'Oversight', title: 'Leave Requests'),
                const SizedBox(height: 16),
                SegmentedButton<ManagerLeaveFilter>(
                  segments: const [
                    ButtonSegment(value: ManagerLeaveFilter.pending, label: Text('Pending')),
                    ButtonSegment(value: ManagerLeaveFilter.all, label: Text('All Requests')),
                  ],
                  selected: {state.filter},
                  onSelectionChanged: (selection) =>
                      context.read<ManagerLeaveCubit>().setFilter(selection.first),
                ),
                const SizedBox(height: 16),
                ResourceView(
                  resource: state.requests,
                  emptyMessage: state.filter == ManagerLeaveFilter.pending
                      ? 'No pending leave requests found.'
                      : 'No leave requests found.',
                  emptyIcon: Icons.fact_check_outlined,
                  onRetry: () => context.read<ManagerLeaveCubit>().load(),
                  isEmpty: (data) => data.isEmpty,
                  builder: (context, requests) => Column(
                    children: requests
                        .map((r) => ManagerLeaveRequestTile(
                              request: r,
                              onReview: ({required approve, required note}) async {
                                final error = await context
                                    .read<ManagerLeaveCubit>()
                                    .review(r.id, approve: approve, note: note);
                                if (error != null && context.mounted) {
                                  ScaffoldMessenger.of(context)
                                      .showSnackBar(SnackBar(content: Text(error)));
                                }
                              },
                            ))
                        .toList(),
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
