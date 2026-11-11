import 'package:workforce_mobile/core/network/api_client.dart';
import 'package:workforce_mobile/core/network/api_endpoints.dart';
import 'package:workforce_mobile/core/session/current_user.dart';

class AuthRepository {
  AuthRepository(this._client);

  final ApiClient _client;

  Future<void> login({required String email, required String password}) {
    return _client.post(ApiEndpoints.login, body: {
      'email': email,
      'password': password,
    });
  }

  Future<CurrentUser> fetchCurrentUser() async {
    final json = await _client.get(ApiEndpoints.me);
    return CurrentUser.fromJson(json);
  }

  /// The PATCH response's `user` object doesn't populate `department` to its
  /// name (only `GET /auth/me` does), so we re-fetch afterwards to keep the
  /// display-friendly department name consistent everywhere.
  Future<CurrentUser> updateCurrentUser(Map<String, dynamic> fields) async {
    await _client.patch(ApiEndpoints.me, body: fields);
    return fetchCurrentUser();
  }

  Future<void> logout() async {
    try {
      await _client.post(ApiEndpoints.logout);
    } finally {
      await _client.clearSession();
    }
  }
}
