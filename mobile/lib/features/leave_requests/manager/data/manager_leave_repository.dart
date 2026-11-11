import 'package:workforce_mobile/core/network/api_client.dart';
import 'package:workforce_mobile/core/network/api_endpoints.dart';

import '../../data/leave_request.dart';

class ManagerLeaveRepository {
  ManagerLeaveRepository(this._client);

  final ApiClient _client;

  Future<List<LeaveRequest>> fetchPending() => _fetch(ApiEndpoints.leaveRequestPending);

  Future<List<LeaveRequest>> fetchAll() => _fetch(ApiEndpoints.leaveRequestAll);

  Future<List<LeaveRequest>> _fetch(String path) async {
    final data = await _client.getRaw(path);
    final list = data as List<dynamic>? ?? const [];
    return list.map((e) => LeaveRequest.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<void> updateStatus(String id, String status, String managerComment) {
    return _client.patch(
      ApiEndpoints.leaveRequestStatus(id),
      body: {'status': status, 'managerComment': managerComment},
    );
  }
}
