import 'package:workforce_mobile/core/network/api_client.dart';
import 'package:workforce_mobile/core/network/api_endpoints.dart';

import '../../data/department.dart';

class DepartmentsRepository {
  DepartmentsRepository(this._client);

  final ApiClient _client;

  Future<List<Department>> fetch() async {
    final json = await _client.get(ApiEndpoints.departments);
    final list = json['departments'] as List<dynamic>? ?? const [];
    return list.map((e) => Department.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<void> create({required String name, String? description, String? managerId}) {
    return _client.post(ApiEndpoints.departments, body: {
      'name': name,
      'description': description,
      'manager': managerId,
    });
  }

  Future<void> update(String id, {required String name, String? description, String? managerId}) {
    return _client.put(ApiEndpoints.departmentById(id), body: {
      'name': name,
      'description': description,
      'manager': managerId,
    });
  }

  Future<void> delete(String id) {
    return _client.delete(ApiEndpoints.departmentById(id));
  }

  /// Manager picker for the department form, from `GET /employees?role=manager`.
  Future<List<ManagerOption>> fetchManagers() async {
    final json = await _client.get(ApiEndpoints.employees, query: {'role': 'manager'});
    final list = json['employees'] as List<dynamic>? ?? const [];
    return list.map((e) => ManagerOption.fromJson(e as Map<String, dynamic>)).toList();
  }
}
