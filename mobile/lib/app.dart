import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'core/network/api_client.dart';
import 'core/routing/app_router.dart';
import 'core/session/auth_cubit.dart';
import 'core/theme/app_theme.dart';

class WorkforceApp extends StatefulWidget {
  const WorkforceApp({super.key, required this.apiClient, required this.authCubit});

  final ApiClient apiClient;
  final AuthCubit authCubit;

  @override
  State<WorkforceApp> createState() => _WorkforceAppState();
}

class _WorkforceAppState extends State<WorkforceApp> {
  late final _router = buildAppRouter(apiClient: widget.apiClient, authCubit: widget.authCubit);

  @override
  Widget build(BuildContext context) {
    return BlocProvider.value(
      value: widget.authCubit,
      child: MaterialApp.router(
        title: 'WorkForce',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.light(),
        routerConfig: _router,
      ),
    );
  }
}
