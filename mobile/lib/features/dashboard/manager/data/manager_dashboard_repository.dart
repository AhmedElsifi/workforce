import 'package:workforce_mobile/core/network/api_client.dart';
import 'package:workforce_mobile/core/network/api_endpoints.dart';

import 'manager_dashboard_stats.dart';

class ManagerDashboardRepository {
  ManagerDashboardRepository(this._client);

  final ApiClient _client;

  Future<ManagerDashboardStats> fetch() async {
    final json = await _client.get(ApiEndpoints.dashboardManager);
    return ManagerDashboardStats.fromJson(json);
  }
}
