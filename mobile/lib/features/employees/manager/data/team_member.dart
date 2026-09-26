import 'package:equatable/equatable.dart';

/// Shape returned by `GET /employees/department/my-team`.
class TeamMember extends Equatable {
  const TeamMember({
    required this.id,
    required this.fname,
    required this.lname,
    required this.email,
    required this.role,
    required this.employmentStatus,
    this.position,
    this.salary,
  });

  factory TeamMember.fromJson(Map<String, dynamic> json) {
    return TeamMember(
      id: (json['_id'] ?? json['id']).toString(),
      fname: json['fname'] as String? ?? '',
      lname: json['lname'] as String? ?? '',
      email: json['email'] as String? ?? '',
      role: json['role'] as String? ?? 'employee',
      employmentStatus: json['employmentStatus'] as String? ?? 'inactive',
      position: json['position'] as String?,
      salary: (json['salary'] as num?)?.toDouble(),
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

  String get fullName => '$fname $lname'.trim();
  bool get isActive => employmentStatus == 'active';

  TeamMember copyWith({String? employmentStatus}) {
    return TeamMember(
      id: id,
      fname: fname,
      lname: lname,
      email: email,
      role: role,
      employmentStatus: employmentStatus ?? this.employmentStatus,
      position: position,
      salary: salary,
    );
  }

  @override
  List<Object?> get props => [id, fname, lname, email, role, employmentStatus, position, salary];
}
