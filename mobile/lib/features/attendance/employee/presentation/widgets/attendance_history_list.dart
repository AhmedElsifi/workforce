import 'package:flutter/material.dart';
import 'package:workforce_mobile/core/theme/app_colors.dart';
import 'package:workforce_mobile/core/utils/formatters.dart';

import '../../data/attendance_record.dart';

class AttendanceHistoryList extends StatelessWidget {
  const AttendanceHistoryList({super.key, required this.records});

  final List<AttendanceRecord> records;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: records
          .map((record) => Card(
                margin: const EdgeInsets.only(bottom: 8),
                child: ListTile(
                  title: Text(Formatters.workDateToLabel(record.workDate)),
                  subtitle: Text(
                    'In: ${Formatters.time(record.checkIn)}   Out: ${Formatters.time(record.checkOut)}',
                    style: const TextStyle(color: AppColors.textMuted),
                  ),
                  trailing: Icon(
                    record.isComplete ? Icons.check_circle : Icons.pending_outlined,
                    color: record.isComplete ? AppColors.success : AppColors.warning,
                  ),
                ),
              ))
          .toList(),
    );
  }
}
