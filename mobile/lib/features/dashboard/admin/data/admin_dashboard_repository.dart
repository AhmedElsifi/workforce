import 'package:workforce_mobile/core/network/api_client.dart';
import 'package:workforce_mobile/core/network/api_endpoints.dart';

import 'admin_dashboard_stats.dart';

class AdminDashboardRepository {
  AdminDashboardRepository(this._client);

  final ApiClient _client;

  Future<AdminDashboardStats> fetch() async {
    final json = await _client.get(ApiEndpoints.dashboardAdmin);
    return AdminDashboardStats.fromJson(json);
  }
}
