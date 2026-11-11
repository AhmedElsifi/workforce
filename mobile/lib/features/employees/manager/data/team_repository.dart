import 'package:workforce_mobile/core/network/api_client.dart';
import 'package:workforce_mobile/core/network/api_endpoints.dart';

import 'team_member.dart';

class TeamRepository {
  TeamRepository(this._client);

  final ApiClient _client;

  Future<List<TeamMember>> fetchTeam() async {
    final json = await _client.get(ApiEndpoints.myTeam);
    final list = json['employees'] as List<dynamic>? ?? const [];
    return list.map((e) => TeamMember.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<void> updateStatus(String employeeId, String employmentStatus) {
    return _client.patch(
      ApiEndpoints.employeeStatus(employeeId),
      body: {'employmentStatus': employmentStatus},
    );
  }
}
