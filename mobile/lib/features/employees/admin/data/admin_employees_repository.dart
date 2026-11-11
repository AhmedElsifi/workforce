import 'package:workforce_mobile/core/network/api_client.dart';
import 'package:workforce_mobile/core/network/api_endpoints.dart';

import 'admin_employee.dart';

class EmployeeFilters {
  const EmployeeFilters({this.search, this.departmentId, this.role, this.status});

  final String? search;
  final String? departmentId;
  final String? role;
  final String? status;

  Map<String, dynamic> toQuery() {
    final query = <String, dynamic>{};
    if (search != null && search!.isNotEmpty) query['search'] = search;
    if (departmentId != null && departmentId!.isNotEmpty) query['department'] = departmentId;
    if (role != null && role!.isNotEmpty) query['role'] = role;
    if (status != null && status!.isNotEmpty) query['status'] = status;
    return query;
  }
}

class AdminEmployeesRepository {
  AdminEmployeesRepository(this._client);

  final ApiClient _client;

  Future<List<AdminEmployee>> fetch(EmployeeFilters filters) async {
    final json = await _client.get(ApiEndpoints.employees, query: filters.toQuery());
    final list = json['employees'] as List<dynamic>? ?? const [];
    return list.map((e) => AdminEmployee.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<void> create({
    required String fname,
    required String lname,
    required String email,
    required String password,
    String? position,
    String? departmentId,
    double? salary,
  }) {
    return _client.post(ApiEndpoints.employees, body: {
      'fname': fname,
      'lname': lname,
      'email': email,
      'password': password,
      if (position != null && position.isNotEmpty) 'position': position,
      'department': departmentId,
      'salary': salary ?? 0,
    });
  }

  Future<void> update(
    String id, {
    String? position,
    required String role,
    String? departmentId,
    double? salary,
    required String employmentStatus,
  }) {
    return _client.put(ApiEndpoints.employeeById(id), body: {
      'position': position,
      'role': role,
      'department': departmentId,
      'salary': salary,
      'employmentStatus': employmentStatus,
    });
  }

  Future<void> deactivate(String id) {
    return _client.patch(ApiEndpoints.employeeDeactivate(id));
  }
}
