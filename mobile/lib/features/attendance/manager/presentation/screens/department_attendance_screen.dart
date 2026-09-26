import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:workforce_mobile/core/utils/formatters.dart';
import 'package:workforce_mobile/core/widgets/page_header.dart';
import 'package:workforce_mobile/core/widgets/resource_view.dart';

import '../../cubit/department_attendance_cubit.dart';
import '../../cubit/department_attendance_state.dart';
import '../../data/department_attendance_record.dart';
import '../widgets/department_attendance_tile.dart';

class DepartmentAttendanceScreen extends StatefulWidget {
  const DepartmentAttendanceScreen({super.key});

  @override
  State<DepartmentAttendanceScreen> createState() => _DepartmentAttendanceScreenState();
}

class _DepartmentAttendanceScreenState extends State<DepartmentAttendanceScreen> {
  String _search = '';

  @override
  void initState() {
    super.initState();
    context.read<DepartmentAttendanceCubit>().load();
  }

  Future<void> _pickDate(DateTime current) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: current,
      firstDate: DateTime(current.year - 1),
      lastDate: DateTime.now(),
    );
    if (picked != null && mounted) {
      context.read<DepartmentAttendanceCubit>().changeDate(picked);
    }
  }

  List<DepartmentAttendanceRecord> _filter(List<DepartmentAttendanceRecord> records) {
    if (_search.isEmpty) return records;
    final q = _search.toLowerCase();
    return records.where((r) => r.employeeName.toLowerCase().contains(q)).toList();
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<DepartmentAttendanceCubit, DepartmentAttendanceState>(
      builder: (context, state) {
        return RefreshIndicator(
          onRefresh: () => context.read<DepartmentAttendanceCubit>().load(),
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const PageHeader(eyebrow: 'Oversight', title: 'Department Attendance'),
                const SizedBox(height: 16),
                OutlinedButton.icon(
                  onPressed: () => _pickDate(state.date),
                  icon: const Icon(Icons.calendar_today_outlined, size: 18),
                  label: Text(Formatters.longDate(state.date)),
                ),
                const SizedBox(height: 12),
                TextField(
                  onChanged: (v) => setState(() => _search = v),
                  decoration: const InputDecoration(
                    hintText: 'Search by employee name',
                    prefixIcon: Icon(Icons.search),
                  ),
                ),
                const SizedBox(height: 16),
                ResourceView<List<DepartmentAttendanceRecord>>(
                  resource: state.records,
                  emptyMessage: 'No attendance records found for this date.',
                  emptyIcon: Icons.event_busy_outlined,
                  onRetry: () => context.read<DepartmentAttendanceCubit>().load(),
                  isEmpty: (data) => _filter(data).isEmpty,
                  builder: (context, data) => Column(
                    children:
                        _filter(data).map((r) => DepartmentAttendanceTile(record: r)).toList(),
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
