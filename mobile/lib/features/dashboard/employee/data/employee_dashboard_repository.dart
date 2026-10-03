import 'package:workforce_mobile/core/network/api_client.dart';
import 'package:workforce_mobile/core/network/api_endpoints.dart';
import 'employee_dashboard_stats.dart';

class EmployeeDashboardRepository {
  EmployeeDashboardRepository(this._client);

  final ApiClient _client;

  Future<EmployeeDashboardStats> fetch() async {
    final json = await _client.get(ApiEndpoints.dashboardEmployee);
    return EmployeeDashboardStats.fromJson(json);
  }
}
