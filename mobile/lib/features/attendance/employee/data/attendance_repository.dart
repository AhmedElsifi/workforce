import 'package:workforce_mobile/core/network/api_client.dart';
import 'package:workforce_mobile/core/network/api_endpoints.dart';

import 'attendance_record.dart';

class AttendanceRepository {
  AttendanceRepository(this._client);

  final ApiClient _client;

  Future<List<AttendanceRecord>> history() async {
    final json = await _client.get(ApiEndpoints.attendanceHistory);
    final list = json['attendance'] as List<dynamic>? ?? const [];
    return list.map((e) => AttendanceRecord.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<AttendanceRecord> checkIn() async {
    final json = await _client.post(ApiEndpoints.attendanceCheckIn);
    return AttendanceRecord.fromJson(json['attendance'] as Map<String, dynamic>);
  }

  Future<AttendanceRecord> checkOut() async {
    final json = await _client.post(ApiEndpoints.attendanceCheckOut);
    return AttendanceRecord.fromJson(json['attendance'] as Map<String, dynamic>);
  }
}
