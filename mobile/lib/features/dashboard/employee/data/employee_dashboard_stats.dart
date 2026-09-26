import 'package:equatable/equatable.dart';

/// Shape of `GET /dashboard/employee` (dashboard.controller.js `employeeDashboard`).
class EmployeeDashboardStats extends Equatable {
  const EmployeeDashboardStats({
    required this.totalAttendanceDays,
    required this.completedAttendanceDays,
    required this.openAttendanceDays,
    required this.pendingLeaveCount,
    required this.totalLeaveRequests,
  });

  factory EmployeeDashboardStats.fromJson(Map<String, dynamic> json) {
    final stats = json['statistics'] as Map<String, dynamic>? ?? const {};
    return EmployeeDashboardStats(
      totalAttendanceDays: (stats['totalAttendanceDays'] as num?)?.toInt() ?? 0,
      completedAttendanceDays: (stats['completedAttendanceDays'] as num?)?.toInt() ?? 0,
      openAttendanceDays: (stats['openAttendanceDays'] as num?)?.toInt() ?? 0,
      pendingLeaveCount: (json['pendingLeaveCount'] as num?)?.toInt() ?? 0,
      totalLeaveRequests: (json['totalLeaveRequests'] as num?)?.toInt() ?? 0,
    );
  }

  final int totalAttendanceDays;
  final int completedAttendanceDays;
  final int openAttendanceDays;
  final int pendingLeaveCount;
  final int totalLeaveRequests;

  @override
  List<Object?> get props => [
        totalAttendanceDays,
        completedAttendanceDays,
        openAttendanceDays,
        pendingLeaveCount,
        totalLeaveRequests,
      ];
}
