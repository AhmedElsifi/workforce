import 'package:equatable/equatable.dart';

import 'current_user.dart';

enum AuthStatus { unknown, authenticated, unauthenticated }

class AuthState extends Equatable {
  const AuthState._({
    required this.status,
    this.user,
    this.errorMessage,
    this.sessionExpired = false,
  });

  const AuthState.unknown() : this._(status: AuthStatus.unknown);

  const AuthState.authenticated(CurrentUser user)
      : this._(status: AuthStatus.authenticated, user: user);

  const AuthState.unauthenticated({String? errorMessage, bool sessionExpired = false})
      : this._(
          status: AuthStatus.unauthenticated,
          errorMessage: errorMessage,
          sessionExpired: sessionExpired,
        );

  final AuthStatus status;
  final CurrentUser? user;
  final String? errorMessage;
  final bool sessionExpired;

  bool get isAuthenticated => status == AuthStatus.authenticated && user != null;

  @override
  List<Object?> get props => [status, user, errorMessage, sessionExpired];
}
