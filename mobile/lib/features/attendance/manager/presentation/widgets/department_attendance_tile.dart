import 'package:flutter/material.dart';
import 'package:workforce_mobile/core/theme/app_colors.dart';
import 'package:workforce_mobile/core/utils/formatters.dart';
import 'package:workforce_mobile/core/widgets/avatar_initials.dart';
import 'package:workforce_mobile/core/widgets/status_pill.dart';

import '../../data/department_attendance_record.dart';

class DepartmentAttendanceTile extends StatelessWidget {
  const DepartmentAttendanceTile({super.key, required this.record});

  final DepartmentAttendanceRecord record;

  @override
  Widget build(BuildContext context) {
    final nameParts = record.employeeName.split(' ');
    final initials = Formatters.initialsOf(
      nameParts.isNotEmpty ? nameParts.first : '',
      nameParts.length > 1 ? nameParts.last : '',
    );

    final hours = record.clockIn != null && record.clockOut != null
        ? (record.clockOut!.difference(record.clockIn!).inMinutes / 60).toStringAsFixed(1)
        : null;

    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: AvatarInitials(initials: initials),
        title: Text(Formatters.titleCase(record.employeeName)),
        subtitle: Text(
          'In: ${Formatters.time(record.clockIn)}   Out: ${Formatters.time(record.clockOut)}'
          '${hours != null ? '   ($hours h)' : ''}',
          style: const TextStyle(color: AppColors.textMuted, fontSize: 12),
        ),
        trailing: StatusPill.attendanceStatus(record.status),
      ),
    );
  }
}
