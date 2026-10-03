import 'package:equatable/equatable.dart';

/// Shared shape for `LeaveRequest` documents (server/db/models/leaveRequest.model.js).
/// On the employee's own `/leave-requests/my-requests`, `employeeId` is a plain
/// ObjectId string. On the manager's `/leave-requests/pending` and
/// `/leave-requests`, it's populated to `{ fname, lname, email }`.
class LeaveRequest extends Equatable {
  const LeaveRequest({
    required this.id,
    required this.leaveType,
    required this.startDate,
    required this.endDate,
    required this.reason,
    required this.status,
    this.managerComment = '',
    this.employeeName,
    this.employeeEmail,
  });

  factory LeaveRequest.fromJson(Map<String, dynamic> json) {
    String? employeeName;
    String? employeeEmail;
    final employeeId = json['employeeId'];
    if (employeeId is Map<String, dynamic>) {
      final fname = employeeId['fname'] as String? ?? '';
      final lname = employeeId['lname'] as String? ?? '';
      employeeName = '$fname $lname'.trim();
      employeeEmail = employeeId['email'] as String?;
    }

    return LeaveRequest(
      id: (json['_id'] ?? json['id']).toString(),
      leaveType: json['leaveType'] as String? ?? 'Annual',
      startDate: DateTime.parse(json['startDate'] as String),
      endDate: DateTime.parse(json['endDate'] as String),
      reason: json['reason'] as String? ?? '',
      status: json['status'] as String? ?? 'Pending',
      managerComment: json['managerComment'] as String? ?? '',
      employeeName: employeeName,
      employeeEmail: employeeEmail,
    );
  }

  final String id;
  final String leaveType;
  final DateTime startDate;
  final DateTime endDate;
  final String reason;
  final String status;
  final String managerComment;
  final String? employeeName;
  final String? employeeEmail;

  bool get isPending => status == 'Pending';

  @override
  List<Object?> get props => [
        id,
        leaveType,
        startDate,
        endDate,
        reason,
        status,
        managerComment,
        employeeName,
        employeeEmail,
      ];
}
