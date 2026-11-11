import 'package:dio/dio.dart';
import 'package:cookie_jar/cookie_jar.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';
import 'package:path_provider/path_provider.dart';

import 'api_exception.dart';
import 'app_config.dart';

/// Thin wrapper over Dio that behaves like a browser: the session cookie set
/// by `POST /auth/login` (httpOnly JWT, no bearer token anywhere) is
/// persisted to disk via [PersistCookieJar] and resent automatically on every
/// request, and survives app restarts just like the web client's cookie does.
///
/// Every non-2xx response and network failure is normalized into an
/// [ApiException] mirroring the web client's `assets/js/*/api.js` pattern.
class ApiClient {
  ApiClient._(this._dio, this._cookieJar);

  final Dio _dio;
  final PersistCookieJar _cookieJar;

  /// Set by [AuthCubit] so a 401 anywhere can force a logout + redirect,
  /// without ApiClient depending on the auth layer directly.
  void Function()? onUnauthorized;

  static Future<ApiClient> create() async {
    final dio = Dio(
      BaseOptions(
        baseUrl: AppConfig.apiBaseUrl,
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 15),
        headers: {'Content-Type': 'application/json'},
      ),
    );

    final dir = await getApplicationDocumentsDirectory();
    final cookieJar = PersistCookieJar(
      storage: FileStorage('${dir.path}/.cookies/'),
    );
    dio.interceptors.add(CookieManager(cookieJar));

    return ApiClient._(dio, cookieJar);
  }

  Future<Map<String, dynamic>> get(
    String path, {
    Map<String, dynamic>? query,
  }) =>
      _send(() => _dio.get(path, queryParameters: query));

  Future<dynamic> getRaw(
    String path, {
    Map<String, dynamic>? query,
  }) =>
      _sendRaw(() => _dio.get(path, queryParameters: query));

  Future<Map<String, dynamic>> post(String path, {Object? body}) =>
      _send(() => _dio.post(path, data: body));

  Future<Map<String, dynamic>> put(String path, {Object? body}) =>
      _send(() => _dio.put(path, data: body));

  Future<Map<String, dynamic>> patch(String path, {Object? body}) =>
      _send(() => _dio.patch(path, data: body));

  Future<Map<String, dynamic>> delete(String path) =>
      _send(() => _dio.delete(path));

  Future<void> clearSession() => _cookieJar.deleteAll();

  Future<Map<String, dynamic>> _send(
    Future<Response> Function() request,
  ) async {
    final data = await _sendRaw(request);
    if (data is Map<String, dynamic>) return data;
    return {'data': data};
  }

  Future<dynamic> _sendRaw(Future<Response> Function() request) async {
    try {
      final response = await request();
      return response.data;
    } on DioException catch (error) {
      throw _mapError(error);
    }
  }

  ApiException _mapError(DioException error) {
    final response = error.response;

    if (response == null) {
      return const ApiException(
        0,
        'Unable to reach the server. Check your connection and try again.',
      );
    }

    final status = response.statusCode ?? 0;
    final body = response.data;
    final serverMessage =
        body is Map<String, dynamic> ? body['message'] as String? : null;
    final errors =
        body is Map<String, dynamic> ? body['errors'] as Map<String, dynamic>? : null;

    if (status == 401) {
      onUnauthorized?.call();
      return const ApiException(401, 'Please sign in again to continue.');
    }

    if (status == 403) {
      return const ApiException(
        403,
        'You do not have permission to view this information.',
      );
    }

    if (status == 400 || status == 409) {
      return ApiException(
        status,
        serverMessage ?? 'Please check the form and try again.',
        fieldErrors: errors,
      );
    }

    if (status == 404) {
      return ApiException(
        status,
        serverMessage ?? 'We could not find what you were looking for.',
      );
    }

    if (status >= 500) {
      return const ApiException(
        500,
        'Something went wrong on our side. Please try again shortly.',
      );
    }

    return ApiException(status, serverMessage ?? 'Something went wrong. Please try again.');
  }
}
