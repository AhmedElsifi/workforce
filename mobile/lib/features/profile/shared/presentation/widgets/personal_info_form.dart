import 'package:flutter/material.dart';
import 'package:workforce_mobile/core/widgets/app_text_field.dart';
import 'package:workforce_mobile/core/widgets/section_card.dart';

class PersonalInfoForm extends StatelessWidget {
  const PersonalInfoForm({
    super.key,
    required this.fnameController,
    required this.lnameController,
    required this.emailController,
    required this.passwordController,
    required this.emailEditable,
  });

  final TextEditingController fnameController;
  final TextEditingController lnameController;
  final TextEditingController emailController;
  final TextEditingController passwordController;
  final bool emailEditable;

  @override
  Widget build(BuildContext context) {
    return SectionCard(
      title: 'Personal Information',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          AppTextField(label: 'First Name', controller: fnameController),
          const SizedBox(height: 12),
          AppTextField(label: 'Last Name', controller: lnameController),
          const SizedBox(height: 12),
          AppTextField(
            label: 'Email Address',
            controller: emailController,
            readOnly: !emailEditable,
            keyboardType: TextInputType.emailAddress,
            helperText: emailEditable
                ? null
                : 'Contact your System Administrator to change your registered email.',
          ),
          const SizedBox(height: 12),
          AppTextField(
            label: 'New Password',
            controller: passwordController,
            obscureText: true,
            helperText: 'Leave blank if you do not wish to change your password.',
          ),
        ],
      ),
    );
  }
}
