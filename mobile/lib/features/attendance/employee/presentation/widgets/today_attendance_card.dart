import 'package:flutter/material.dart';
import 'package:workforce_mobile/core/theme/app_colors.dart';
import 'package:workforce_mobile/core/utils/formatters.dart';
import 'package:workforce_mobile/core/widgets/primary_button.dart';
import 'package:workforce_mobile/core/widgets/section_card.dart';

import '../../data/attendance_record.dart';

class TodayAttendanceCard extends StatelessWidget {
  const TodayAttendanceCard({
    super.key,
    required this.record,
    required this.isSubmitting,
    required this.onCheckIn,
    required this.onCheckOut,
  });

  final AttendanceRecord? record;
  final bool isSubmitting;
  final VoidCallback onCheckIn;
  final VoidCallback onCheckOut;

  @override
  Widget build(BuildContext context) {
    final today = Formatters.longDate(DateTime.now());

    String statusText;
    Color statusColor;
    if (record == null) {
      statusText = 'Not checked in';
      statusColor = AppColors.textMuted;
    } else if (record!.isOpen) {
      statusText = 'Checked in';
      statusColor = AppColors.success;
    } else {
      statusText = 'Completed';
      statusColor = AppColors.primary;
    }

    return SectionCard(
      title: "Today's Attendance",
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(today, style: const TextStyle(color: AppColors.textMuted, fontSize: 13)),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: _TimeTile(label: 'Check in', value: Formatters.time(record?.checkIn)),
              ),
              Expanded(
                child: _TimeTile(label: 'Check out', value: Formatters.time(record?.checkOut)),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: statusColor.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(999),
            ),
            child: Text(
              statusText,
              style: TextStyle(color: statusColor, fontWeight: FontWeight.w600, fontSize: 12),
            ),
          ),
          const SizedBox(height: 16),
          if (record == null)
            PrimaryButton(
              label: 'Check In',
              icon: Icons.login,
              loading: isSubmitting,
              onPressed: onCheckIn,
            )
          else if (record!.isOpen)
            PrimaryButton(
              label: 'Check Out',
              icon: Icons.logout,
              loading: isSubmitting,
              onPressed: onCheckOut,
            )
          else
            const Text(
              "You're all done for today.",
              style: TextStyle(color: AppColors.textMuted, fontSize: 13),
            ),
        ],
      ),
    );
  }
}

class _TimeTile extends StatelessWidget {
  const _TimeTile({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: AppColors.textMuted, fontSize: 12)),
        const SizedBox(height: 2),
        Text(
          value,
          style: const TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w700, fontSize: 16),
        ),
      ],
    );
  }
}
