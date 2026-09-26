import 'package:workforce_mobile/core/network/api_client.dart';
import 'package:workforce_mobile/core/network/api_endpoints.dart';

import '../../data/leave_request.dart';

class EmployeeLeaveRepository {
  EmployeeLeaveRepository(this._client);

  final ApiClient _client;

  Future<List<LeaveRequest>> myRequests() async {
    final data = await _client.getRaw(ApiEndpoints.leaveRequestMine);
    final list = data as List<dynamic>? ?? const [];
    return list.map((e) => LeaveRequest.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<void> submit({
    required String leaveType,
    required DateTime startDate,
    required DateTime endDate,
    required String reason,
  }) {
    return _client.post(ApiEndpoints.leaveRequestNew, body: {
      'leaveType': leaveType,
      'startDate': startDate.toIso8601String(),
      'endDate': endDate.toIso8601String(),
      'reason': reason,
    });
  }
}
