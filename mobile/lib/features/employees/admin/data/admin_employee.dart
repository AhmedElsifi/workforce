import 'package:equatable/equatable.dart';

/// Shape returned by `GET /employees` / `GET /employees/:id` for the admin
/// portal: `department` is populated to `{ _id, name }` or null.
class AdminEmployee extends Equatable {
  const AdminEmployee({
    required this.id,
    required this.fname,
    required this.lname,
    required this.email,
    required this.role,
    required this.employmentStatus,
    this.position,
    this.salary,
    this.departmentId,
    this.departmentName,
  });

  factory AdminEmployee.fromJson(Map<String, dynamic> json) {
    String? departmentId;
    String? departmentName;
    final department = json['department'];
    if (department is Map<String, dynamic>) {
      departmentId = (department['_id'] ?? department['id'])?.toString();
      departmentName = department['name'] as String?;
    } else if (department is String) {
      departmentId = department;
    }

    return AdminEmployee(
      id: (json['_id'] ?? json['id']).toString(),
      fname: json['fname'] as String? ?? '',
      lname: json['lname'] as String? ?? '',
      email: json['email'] as String? ?? '',
      role: json['role'] as String? ?? 'employee',
      employmentStatus: json['employmentStatus'] as String? ?? 'inactive',
      position: json['position'] as String?,
      salary: (json['salary'] as num?)?.toDouble(),
      departmentId: departmentId,
      departmentName: departmentName,
    );
  }

  final String id;
  final String fname;
  final String lname;
  final String email;
  final String role;
  final String employmentStatus;
  final String? position;
  final double? salary;
  final String? departmentId;
  final String? departmentName;

  String get fullName => '$fname $lname'.trim();
  bool get isActive => employmentStatus == 'active';

  @override
  List<Object?> get props => [
        id,
        fname,
        lname,
        email,
        role,
        employmentStatus,
        position,
        salary,
        departmentId,
        departmentName,
      ];
}
