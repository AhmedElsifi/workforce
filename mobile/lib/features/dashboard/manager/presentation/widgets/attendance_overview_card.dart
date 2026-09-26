import 'package:flutter/material.dart';
import 'package:workforce_mobile/core/theme/app_colors.dart';
import 'package:workforce_mobile/core/widgets/section_card.dart';

class AttendanceOverviewCard extends StatelessWidget {
  const AttendanceOverviewCard({
    super.key,
    required this.presentToday,
    required this.absentToday,
    required this.clockInRate,
  });

  final int presentToday;
  final int absentToday;
  final int clockInRate;

  @override
  Widget build(BuildContext context) {
    return SectionCard(
      title: "Today's Attendance Overview",
      child: Row(
        children: [
          SizedBox(
            width: 84,
            height: 84,
            child: Stack(
              alignment: Alignment.center,
              children: [
                CircularProgressIndicator(
                  value: clockInRate / 100,
                  strokeWidth: 8,
                  backgroundColor: AppColors.border,
                  valueColor: const AlwaysStoppedAnimation(AppColors.primary),
                ),
                Text('$clockInRate%', style: const TextStyle(fontWeight: FontWeight.w700)),
              ],
            ),
          ),
          const SizedBox(width: 20),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _Dot(color: AppColors.success, label: 'Present', value: presentToday),
                const SizedBox(height: 8),
                _Dot(color: AppColors.danger, label: 'Absent', value: absentToday),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _Dot extends StatelessWidget {
  const _Dot({required this.color, required this.label, required this.value});

  final Color color;
  final String label;
  final int value;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(width: 10, height: 10, decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
        const SizedBox(width: 8),
        Text('$label: ', style: const TextStyle(color: AppColors.textMuted)),
        Text('$value', style: const TextStyle(fontWeight: FontWeight.w700)),
      ],
    );
  }
}
