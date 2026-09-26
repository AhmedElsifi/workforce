import 'package:equatable/equatable.dart';

class DepartmentDistributionItem extends Equatable {
  const DepartmentDistributionItem({required this.name, required this.employeeCount});

  factory DepartmentDistributionItem.fromJson(Map<String, dynamic> json) {
    return DepartmentDistributionItem(
      name: json['name'] as String? ?? 'Unnamed',
      employeeCount: (json['employeeCount'] as num?)?.toInt() ?? 0,
    );
  }

  final String name;
  final int employeeCount;

  @override
  List<Object?> get props => [name, employeeCount];
}

class RecentActivityItem extends Equatable {
  const RecentActivityItem({required this.description, required this.createdAt});

  factory RecentActivityItem.fromJson(Map<String, dynamic> json) {
    return RecentActivityItem(
      description: json['description'] as String? ?? '',
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }

  final String description;
  final DateTime createdAt;

  @override
  List<Object?> get props => [description, createdAt];
}

/// Shape of `GET /dashboard/admin` (dashboard.controller.js `adminDashboard`).
class AdminDashboardStats extends Equatable {
  const AdminDashboardStats({
    required this.totalEmployees,
    required this.activeEmployees,
    required this.inactiveEmployees,
    required this.pendingLeaveRequests,
    required this.departmentDistribution,
    required this.recentActivity,
  });

  factory AdminDashboardStats.fromJson(Map<String, dynamic> json) {
    final kpis = json['kpis'] as Map<String, dynamic>? ?? const {};
    final departments = json['departmentDistribution'] as List<dynamic>? ?? const [];
    final activity = json['recentActivity'] as List<dynamic>? ?? const [];

    return AdminDashboardStats(
      totalEmployees: (kpis['totalEmployees'] as num?)?.toInt() ?? 0,
      activeEmployees: (kpis['activeEmployees'] as num?)?.toInt() ?? 0,
      inactiveEmployees: (kpis['inactiveEmployees'] as num?)?.toInt() ?? 0,
      pendingLeaveRequests: (json['pendingLeaveRequests'] as num?)?.toInt() ?? 0,
      departmentDistribution: departments
          .map((e) => DepartmentDistributionItem.fromJson(e as Map<String, dynamic>))
          .toList(),
      recentActivity:
          activity.map((e) => RecentActivityItem.fromJson(e as Map<String, dynamic>)).toList(),
    );
  }

  final int totalEmployees;
  final int activeEmployees;
  final int inactiveEmployees;
  final int pendingLeaveRequests;
  final List<DepartmentDistributionItem> departmentDistribution;
  final List<RecentActivityItem> recentActivity;

  @override
  List<Object?> get props => [
        totalEmployees,
        activeEmployees,
        inactiveEmployees,
        pendingLeaveRequests,
        departmentDistribution,
        recentActivity,
      ];
}
