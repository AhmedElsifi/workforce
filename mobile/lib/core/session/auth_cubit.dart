import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:workforce_mobile/features/auth/data/auth_repository.dart';
import 'package:workforce_mobile/core/network/api_client.dart';
import 'package:workforce_mobile/core/network/api_exception.dart';
import 'auth_state.dart';
import 'current_user.dart';

/// Single source of truth for "who is logged in", used by the router to
/// decide which shell (or the login screen) to show, and by every feature
/// that needs the current user (avatar, profile screen, role checks).
class AuthCubit extends Cubit<AuthState> {
  AuthCubit(this._apiClient, this._repository) : super(const AuthState.unknown()) {
    _apiClient.onUnauthorized = _handleUnauthorized;
  }

  final ApiClient _apiClient;
  final AuthRepository _repository;

  Future<void> checkSession() async {
    try {
      final user = await _repository.fetchCurrentUser();
      emit(AuthState.authenticated(user));
    } on ApiException {
      emit(const AuthState.unauthenticated());
    }
  }

  Future<void> login({required String email, required String password}) async {
    try {
      await _repository.login(email: email, password: password);
      final user = await _repository.fetchCurrentUser();
      emit(AuthState.authenticated(user));
    } on ApiException catch (error) {
      emit(AuthState.unauthenticated(errorMessage: error.message));
    }
  }

  Future<void> refreshCurrentUser() async {
    try {
      final user = await _repository.fetchCurrentUser();
      emit(AuthState.authenticated(user));
    } on ApiException {
      // Leave the current state as-is; the caller's own request already
      // surfaces the error, and a 401 is handled globally below.
    }
  }

  /// Lets a feature (e.g. the profile screen) push a freshly-fetched user
  /// back into the app-wide session after it updates its own profile,
  /// without a redundant extra `GET /auth/me` round trip.
  void applyUpdatedUser(CurrentUser user) => emit(AuthState.authenticated(user));

  Future<void> logout() async {
    await _repository.logout();
    emit(const AuthState.unauthenticated());
  }

  void _handleUnauthorized() {
    if (state.status != AuthStatus.authenticated) return;
    emit(const AuthState.unauthenticated(
      sessionExpired: true,
      errorMessage: 'Your session has expired. Please sign in again.',
    ));
  }
}
