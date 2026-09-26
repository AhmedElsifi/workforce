import 'package:flutter/material.dart';

class AppTextField extends StatelessWidget {
  const AppTextField({
    super.key,
    required this.label,
    this.controller,
    this.obscureText = false,
    this.keyboardType,
    this.errorText,
    this.helperText,
    this.readOnly = false,
    this.maxLines = 1,
    this.suffixIcon,
    this.onChanged,
  });

  final String label;
  final TextEditingController? controller;
  final bool obscureText;
  final TextInputType? keyboardType;
  final String? errorText;
  final String? helperText;
  final bool readOnly;
  final int maxLines;
  final Widget? suffixIcon;
  final ValueChanged<String>? onChanged;

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: controller,
      obscureText: obscureText,
      keyboardType: keyboardType,
      readOnly: readOnly,
      maxLines: obscureText ? 1 : maxLines,
      onChanged: onChanged,
      decoration: InputDecoration(
        labelText: label,
        errorText: errorText,
        helperText: helperText,
        suffixIcon: suffixIcon,
        filled: readOnly ? true : null,
        fillColor: readOnly ? const Color(0xFFF1F5F9) : null,
      ),
    );
  }
}
