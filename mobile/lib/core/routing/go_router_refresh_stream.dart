import 'dart:async';

import 'package:flutter/foundation.dart';

/// Bridges a Cubit's state stream to go_router's `refreshListenable`, so a
/// route redirect re-evaluates whenever [AuthCubit] emits.
class GoRouterRefreshStream extends ChangeNotifier {
  GoRouterRefreshStream(Stream<dynamic> stream) {
    _subscription = stream.asBroadcastStream().listen((_) => notifyListeners());
  }

  late final StreamSubscription<dynamic> _subscription;

  @override
  void dispose() {
    _subscription.cancel();
    super.dispose();
  }
}
