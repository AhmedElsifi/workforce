import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';
import 'package:workforce_mobile/core/widgets/page_header.dart';
import 'package:workforce_mobile/core/widgets/resource_view.dart';

import '../../cubit/attendance_cubit.dart';
import '../../cubit/attendance_state.dart';
import '../widgets/attendance_history_list.dart';
import '../widgets/today_attendance_card.dart';

class AttendanceScreen extends StatefulWidget {
  const AttendanceScreen({super.key});

  @override
  State<AttendanceScreen> createState() => _AttendanceScreenState();
}

class _AttendanceScreenState extends State<AttendanceScreen> {
  final _todayWorkDate = DateFormat('yyyy-MM-dd').format(DateTime.now());

  @override
  void initState() {
    super.initState();
    context.read<AttendanceCubit>().load();
  }

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<AttendanceCubit, AttendanceState>(
      listenWhen: (previous, current) =>
          current.actionMessage != null && current.actionMessage != previous.actionMessage,
      listener: (context, state) {
        ScaffoldMessenger.of(context)
          ..hideCurrentSnackBar()
          ..showSnackBar(SnackBar(content: Text(state.actionMessage!)));
      },
      builder: (context, state) {
        return RefreshIndicator(
          onRefresh: () => context.read<AttendanceCubit>().load(),
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const PageHeader(
                  eyebrow: 'Time & Attendance',
                  title: 'My Attendance',
                  subtitle: "Record today's attendance and review your history.",
                ),
                const SizedBox(height: 20),
                TodayAttendanceCard(
                  record: state.todayRecord(_todayWorkDate),
                  isSubmitting: state.isSubmitting,
                  onCheckIn: () => context.read<AttendanceCubit>().checkIn(),
                  onCheckOut: () => context.read<AttendanceCubit>().checkOut(),
                ),
                const SizedBox(height: 20),
                const Text(
                  'Attendance History',
                  style: TextStyle(fontWeight: FontWeight.w700, fontSize: 16),
                ),
                const SizedBox(height: 12),
                ResourceView(
                  resource: state.history,
                  emptyMessage: 'No attendance records yet.',
                  emptyIcon: Icons.history,
                  onRetry: () => context.read<AttendanceCubit>().load(),
                  isEmpty: (data) => data.isEmpty,
                  builder: (context, records) => AttendanceHistoryList(records: records),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
