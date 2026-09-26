import 'package:equatable/equatable.dart';

import 'user_role.dart';

/// Shape returned by `GET /auth/me` (server/src/modules/auth/auth.controller.js
/// `getCurrentUser`): fname, lname, email, role, position, salary,
/// employmentStatus, and department already flattened to its name (or null).
class CurrentUser extends Equatable {
  const CurrentUser({
    required this.fname,
    required this.lname,
    required this.email,
    required this.role,
    this.position,
    this.salary,
    this.employmentStatus,
    this.department,
  });

  factory CurrentUser.fromJson(Map<String, dynamic> json) {
    return CurrentUser(
      fname: (json['fname'] as String?) ?? '',
      lname: (json['lname'] as String?) ?? '',
      email: (json['email'] as String?) ?? '',
      role: UserRole.fromString(json['role'] as String?),
      position: json['position'] as String?,
      salary: (json['salary'] as num?)?.toDouble(),
      employmentStatus: json['employmentStatus'] as String?,
      department: json['department'] as String?,
    );
  }

  final String fname;
  final String lname;
  final String email;
  final UserRole role;
  final String? position;
  final double? salary;
  final String? employmentStatus;
  final String? department;

  String get fullName => '$fname $lname'.trim();

  String get initials {
    final f = fname.isNotEmpty ? fname[0] : '';
    final l = lname.isNotEmpty ? lname[0] : '';
    final result = '$f$l'.toUpperCase();
    return result.isEmpty ? '-' : result;
  }

  bool get isActive => employmentStatus == 'active';

  @override
  List<Object?> get props =>
      [fname, lname, email, role, position, salary, employmentStatus, department];
}
