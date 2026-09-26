import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:workforce_mobile/core/session/auth_cubit.dart';
import 'package:workforce_mobile/core/session/auth_state.dart';
import 'package:workforce_mobile/core/theme/app_colors.dart';
import 'package:workforce_mobile/features/auth/presentation/widgets/login_form.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final isCheckingSession = context.select<AuthCubit, bool>(
      (cubit) => cubit.state.status == AuthStatus.unknown,
    );

    if (isCheckingSession) {
      return const Scaffold(
        backgroundColor: AppColors.background,
        body: Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: BlocListener<AuthCubit, AuthState>(
          listenWhen: (previous, current) =>
              current.status == AuthStatus.unauthenticated && current.errorMessage != null,
          listener: (context, state) {
            ScaffoldMessenger.of(context)
              ..hideCurrentSnackBar()
              ..showSnackBar(SnackBar(content: Text(state.errorMessage!)));
          },
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 420),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Row(
                      children: [
                        Container(
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            color: AppColors.primaryDark,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Icon(Icons.groups, color: Colors.white),
                        ),
                        const SizedBox(width: 12),
                        const Text(
                          'WorkForce',
                          style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700),
                        ),
                      ],
                    ),
                    const SizedBox(height: 32),
                    const Text(
                      'Welcome back',
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.w700,
                        color: AppColors.sidebarAlt,
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Enter your organization credentials to access your workspace.',
                      style: TextStyle(color: AppColors.textMuted),
                    ),
                    const SizedBox(height: 32),
                    const LoginForm(),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
