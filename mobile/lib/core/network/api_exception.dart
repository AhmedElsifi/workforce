/// Mirrors the web client's `ApiError` (assets/js/employee/api.js): carries an
/// HTTP status (0 for network failure) plus a user-facing message, and
/// optionally field-level validation errors from the server's `errors` object.
class ApiException implements Exception {
  const ApiException(this.status, this.message, {this.fieldErrors});

  final int status;
  final String message;
  final Map<String, dynamic>? fieldErrors;

  bool get isAuthError => status == 401;
  bool get isForbidden => status == 403;
  bool get isNetworkError => status == 0;

  String? fieldError(String field) {
    final value = fieldErrors?[field];
    return value is String ? value : null;
  }

  @override
  String toString() => message;
}
