import 'dart:async';

import 'package:flutter/material.dart';

import 'app.dart';
import 'core/network/api_client.dart';
import 'core/session/auth_cubit.dart';
import 'features/auth/data/auth_repository.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final apiClient = await ApiClient.create();
  final authCubit = AuthCubit(apiClient, AuthRepository(apiClient));
  unawaited(authCubit.checkSession());

  runApp(WorkforceApp(apiClient: apiClient, authCubit: authCubit));
}
