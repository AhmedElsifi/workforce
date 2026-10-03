import 'package:equatable/equatable.dart';

/// Shape of one item in `GET /attendance/department` (attendance.controller.js
/// `getDepartmentAttendance`): status is computed server-side as
/// present/absent/late.
class DepartmentAttendanceRecord extends Equatable {
  const DepartmentAttendanceRecord({
    required this.id,
    required this.date,
    required this.status,
    required this.employeeName,
    this.employeePosition,
    this.clockIn,
    this.clockOut,
  });

  factory DepartmentAttendanceRecord.fromJson(Map<String, dynamic> json) {
    final employee = json['employee'] as Map<String, dynamic>? ?? const {};
    final fname = employee['fname'] as String? ?? '';
    final lname = employee['lname'] as String? ?? '';

    return DepartmentAttendanceRecord(
      id: (json['_id'] ?? json['id']).toString(),
      date: json['date'] as String? ?? '',
      status: json['status'] as String? ?? 'absent',
      employeeName: '$fname $lname'.trim(),
      employeePosition: employee['position'] as String?,
      clockIn: json['clockIn'] == null ? null : DateTime.parse(json['clockIn'] as String),
      clockOut: json['clockOut'] == null ? null : DateTime.parse(json['clockOut'] as String),
    );
  }

  final String id;
  final String date;
  final String status;
  final String employeeName;
  final String? employeePosition;
  final DateTime? clockIn;
  final DateTime? clockOut;

  @override
  List<Object?> get props => [id, date, status, employeeName, employeePosition, clockIn, clockOut];
}
