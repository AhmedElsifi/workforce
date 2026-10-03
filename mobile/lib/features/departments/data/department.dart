import 'package:equatable/equatable.dart';

/// Shape of a department document (server/db/models/department.model.js),
/// as returned by `GET /departments` with `manager` populated and a
/// server-computed `headcount` of active employees.
class Department extends Equatable {
  const Department({
    required this.id,
    required this.name,
    this.description,
    this.managerId,
    this.managerName,
    this.headcount = 0,
  });

  factory Department.fromJson(Map<String, dynamic> json) {
    String? managerId;
    String? managerName;
    final manager = json['manager'];
    if (manager is Map<String, dynamic>) {
      managerId = (manager['_id'] ?? manager['id'])?.toString();
      final fname = manager['fname'] as String? ?? '';
      final lname = manager['lname'] as String? ?? '';
      managerName = '$fname $lname'.trim();
    }

    return Department(
      id: (json['_id'] ?? json['id']).toString(),
      name: json['name'] as String? ?? '',
      description: json['description'] as String?,
      managerId: managerId,
      managerName: managerName,
      headcount: (json['headcount'] as num?)?.toInt() ?? 0,
    );
  }

  final String id;
  final String name;
  final String? description;
  final String? managerId;
  final String? managerName;
  final int headcount;

  @override
  List<Object?> get props => [id, name, description, managerId, managerName, headcount];
}

/// Minimal shape for the "manager" picker, sourced from
/// `GET /employees?role=manager`.
class ManagerOption extends Equatable {
  const ManagerOption({required this.id, required this.fname, required this.lname});

  factory ManagerOption.fromJson(Map<String, dynamic> json) {
    return ManagerOption(
      id: (json['_id'] ?? json['id']).toString(),
      fname: json['fname'] as String? ?? '',
      lname: json['lname'] as String? ?? '',
    );
  }

  final String id;
  final String fname;
  final String lname;

  String get fullName => '$fname $lname'.trim();

  @override
  List<Object?> get props => [id, fname, lname];
}
