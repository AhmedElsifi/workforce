import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:workforce_mobile/core/session/auth_cubit.dart';
import 'package:workforce_mobile/core/session/current_user.dart';
import 'package:workforce_mobile/core/session/user_role.dart';
import 'package:workforce_mobile/core/widgets/page_header.dart';
import 'package:workforce_mobile/core/widgets/primary_button.dart';
import 'package:workforce_mobile/features/profile/shared/cubit/profile_cubit.dart';
import 'package:workforce_mobile/features/profile/shared/cubit/profile_state.dart';

import '../widgets/admin_employment_form.dart';
import '../widgets/employment_details_view.dart';
import '../widgets/personal_info_form.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _fnameController = TextEditingController();
  final _lnameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _positionController = TextEditingController();
  final _salaryController = TextEditingController();
  UserRole _role = UserRole.employee;
  String _employmentStatus = 'active';
  CurrentUser? _loadedFor;

  @override
  void dispose() {
    _fnameController.dispose();
    _lnameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _positionController.dispose();
    _salaryController.dispose();
    super.dispose();
  }

  void _populate(CurrentUser user) {
    if (identical(_loadedFor, user)) return;
    _loadedFor = user;
    _fnameController.text = user.fname;
    _lnameController.text = user.lname;
    _emailController.text = user.email;
    _positionController.text = user.position ?? '';
    _salaryController.text = user.salary?.toString() ?? '';
    _role = user.role;
    _employmentStatus = user.employmentStatus ?? 'active';
  }

  void _save(bool isAdmin) {
    final fields = <String, dynamic>{
      'fname': _fnameController.text.trim(),
      'lname': _lnameController.text.trim(),
    };
    if (_passwordController.text.isNotEmpty) {
      fields['password'] = _passwordController.text;
    }
    if (isAdmin) {
      fields['email'] = _emailController.text.trim();
      fields['role'] = _role.name;
      fields['position'] = _positionController.text.trim();
      fields['employmentStatus'] = _employmentStatus;
      final salary = double.tryParse(_salaryController.text);
      if (salary != null) fields['salary'] = salary;
    }
    context.read<ProfileCubit>().save(fields);
    _passwordController.clear();
  }

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthCubit>().state.user;
    if (user == null) {
      return const Center(child: CircularProgressIndicator());
    }
    _populate(user);
    final isAdmin = user.role == UserRole.admin;

    return BlocConsumer<ProfileCubit, ProfileFormState>(
      listenWhen: (previous, current) =>
          current.message != null && current.message != previous.message,
      listener: (context, state) {
        ScaffoldMessenger.of(context)
          ..hideCurrentSnackBar()
          ..showSnackBar(SnackBar(content: Text(state.message!)));
      },
      builder: (context, state) {
        return SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const PageHeader(
                eyebrow: 'Account & Security',
                title: 'My Profile',
                subtitle: 'Manage your personal information and employment details.',
              ),
              const SizedBox(height: 20),
              PersonalInfoForm(
                fnameController: _fnameController,
                lnameController: _lnameController,
                emailController: _emailController,
                passwordController: _passwordController,
                emailEditable: isAdmin,
              ),
              const SizedBox(height: 16),
              if (isAdmin)
                AdminEmploymentForm(
                  positionController: _positionController,
                  salaryController: _salaryController,
                  role: _role,
                  employmentStatus: _employmentStatus,
                  onRoleChanged: (r) => setState(() => _role = r ?? _role),
                  onStatusChanged: (s) => setState(() => _employmentStatus = s ?? _employmentStatus),
                )
              else
                EmploymentDetailsView(user: user),
              const SizedBox(height: 20),
              PrimaryButton(
                label: 'Save Profile Changes',
                icon: Icons.save_outlined,
                loading: state.isSubmitting,
                onPressed: () => _save(isAdmin),
              ),
              const SizedBox(height: 24),
              OutlinedButton.icon(
                onPressed: () => context.read<AuthCubit>().logout(),
                icon: const Icon(Icons.logout),
                label: const Text('Log Out'),
              ),
            ],
          ),
        );
      },
    );
  }
}
