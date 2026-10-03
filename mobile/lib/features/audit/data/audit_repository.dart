import 'package:workforce_mobile/core/network/api_client.dart';
import 'package:workforce_mobile/core/network/api_endpoints.dart';

import 'audit_log_entry.dart';

class AuditRepository {
  AuditRepository(this._client);

  final ApiClient _client;

  Future<AuditPage> fetch({required int page, String? category}) async {
    final json = await _client.get(ApiEndpoints.audit, query: {
      'page': page,
      'limit': 20,
      if (category != null && category.isNotEmpty) 'category': category,
    });
    return AuditPage.fromJson(json);
  }
}
