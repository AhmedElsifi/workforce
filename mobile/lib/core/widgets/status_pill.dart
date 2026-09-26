import 'package:flutter/material.dart';

import 'package:workforce_mobile/core/theme/app_colors.dart';

/// One pill widget for every colored status/type badge the web client shows:
/// employment status, leave status, leave type, and audit category.
class StatusPill extends StatelessWidget {
  const StatusPill({
    super.key,
    required this.label,
    required this.background,
    required this.foreground,
  });

  factory StatusPill.employmentStatus(String status) {
    final active = status == 'active';
    return StatusPill(
      label: active ? 'Active' : 'Inactive',
      background: active ? AppColors.successBg : AppColors.inactiveBg,
      foreground: active ? AppColors.successDark : AppColors.inactiveText,
    );
  }

  factory StatusPill.leaveStatus(String status) {
    switch (status) {
      case 'Approved':
        return const StatusPill(
          label: 'Approved',
          background: AppColors.successBg,
          foreground: AppColors.successDark,
        );
      case 'Rejected':
        return const StatusPill(
          label: 'Rejected',
          background: AppColors.dangerBg,
          foreground: AppColors.dangerDark,
        );
      default:
        return const StatusPill(
          label: 'Pending',
          background: AppColors.warningBg,
          foreground: AppColors.warningDark,
        );
    }
  }

  factory StatusPill.leaveType(String type) {
    switch (type) {
      case 'Annual':
        return const StatusPill(
          label: 'Annual',
          background: AppColors.successBg,
          foreground: AppColors.successDark,
        );
      case 'Sick':
        return const StatusPill(
          label: 'Sick',
          background: AppColors.dangerBg,
          foreground: AppColors.dangerDark,
        );
      case 'Unpaid':
        return const StatusPill(
          label: 'Unpaid',
          background: AppColors.inactiveBg,
          foreground: AppColors.inactiveText,
        );
      default:
        return StatusPill(
          label: type,
          background: AppColors.neutralBg,
          foreground: AppColors.neutral,
        );
    }
  }

  factory StatusPill.attendanceStatus(String status) {
    switch (status) {
      case 'absent':
        return const StatusPill(
          label: 'Absent',
          background: AppColors.dangerBg,
          foreground: AppColors.dangerDark,
        );
      case 'late':
        return const StatusPill(
          label: 'Late',
          background: AppColors.warningBg,
          foreground: AppColors.warningDark,
        );
      default:
        return const StatusPill(
          label: 'Present',
          background: AppColors.successBg,
          foreground: AppColors.successDark,
        );
    }
  }

  factory StatusPill.category(String category) {
    return StatusPill(
      label: category.isEmpty
          ? 'System'
          : '${category[0].toUpperCase()}${category.substring(1)}',
      background: AppColors.neutralBg,
      foreground: AppColors.neutral,
    );
  }

  final String label;
  final Color background;
  final Color foreground;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: background,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: foreground,
          fontWeight: FontWeight.w600,
          fontSize: 12,
        ),
      ),
    );
  }
}
