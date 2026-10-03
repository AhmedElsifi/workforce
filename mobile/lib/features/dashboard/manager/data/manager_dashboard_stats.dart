import 'package:equatable/equatable.dart';

/// Shape of `GET /dashboard/manager` (dashboard.controller.js `managerDashboard`).
class ManagerDashboardStats extends Equatable {
  const ManagerDashboardStats({
    required this.departmentName,
    required this.totalEmployees,
    required this.activeEmployees,
    required this.inactiveEmployees,
    required this.pendingLeaveRequests,
    required this.presentToday,
    required this.absentToday,
    required this.clockInRate,
  });

  factory ManagerDashboardStats.fromJson(Map<String, dynamic> json) {
    final department = json['department'] as Map<String, dynamic>? ?? const {};
    final kpis = json['kpis'] as Map<String, dynamic>? ?? const {};
    final attendance = json['attendanceOverview'] as Map<String, dynamic>? ?? const {};

    return ManagerDashboardStats(
      departmentName: department['name'] as String? ?? 'your department',
      totalEmployees: (kpis['totalEmployees'] as num?)?.toInt() ?? 0,
      activeEmployees: (kpis['activeEmployees'] as num?)?.toInt() ?? 0,
      inactiveEmployees: (kpis['inactiveEmployees'] as num?)?.toInt() ?? 0,
      pendingLeaveRequests: (json['pendingLeaveRequests'] as num?)?.toInt() ?? 0,
      presentToday: (attendance['presentToday'] as num?)?.toInt() ?? 0,
      absentToday: (attendance['absentToday'] as num?)?.toInt() ?? 0,
      clockInRate: (attendance['clockInRate'] as num?)?.toInt() ?? 0,
    );
  }

  final String departmentName;
  final int totalEmployees;
  final int activeEmployees;
  final int inactiveEmployees;
  final int pendingLeaveRequests;
  final int presentToday;
  final int absentToday;
  final int clockInRate;

  @override
  List<Object?> get props => [
        departmentName,
        totalEmployees,
        activeEmployees,
        inactiveEmployees,
        pendingLeaveRequests,
        presentToday,
        absentToday,
        clockInRate,
      ];
}
