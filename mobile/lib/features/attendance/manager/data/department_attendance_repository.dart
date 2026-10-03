import 'package:intl/intl.dart';
import 'package:workforce_mobile/core/network/api_client.dart';
import 'package:workforce_mobile/core/network/api_endpoints.dart';

import 'department_attendance_record.dart';

class DepartmentAttendanceRepository {
  DepartmentAttendanceRepository(this._client);

  final ApiClient _client;

  Future<List<DepartmentAttendanceRecord>> fetch(DateTime date) async {
    final json = await _client.get(
      ApiEndpoints.attendanceDepartment,
      query: {'date': DateFormat('yyyy-MM-dd').format(date)},
    );
    final list = json['records'] as List<dynamic>? ?? const [];
    return list
        .map((e) => DepartmentAttendanceRecord.fromJson(e as Map<String, dynamic>))
        .toList();
  }
}
