import 'package:flutter/material.dart';

/// Colors lifted directly from the web client's CSS (global.css, auth/login.css,
/// employee/sidebar.css) so the mobile app reads as the same product.
class AppColors {
  AppColors._();

  static const primary = Color(0xFF6366F1);
  static const primaryDark = Color(0xFF4F46E5);

  static const sidebar = Color(0xFF1A1E2D);
  static const sidebarAlt = Color(0xFF0F172A);
  static const sidebarHighlight = Color(0xFF262C41);

  static const background = Color(0xFFF8FAFC);
  static const surface = Color(0xFFFFFFFF);
  static const border = Color(0xFFE2E8F0);

  static const textPrimary = Color(0xFF1E293B);
  static const textMuted = Color(0xFF64748B);
  static const textFaint = Color(0xFF94A3B8);

  static const success = Color(0xFF10B981);
  static const successDark = Color(0xFF166534);
  static const successBg = Color(0xFFDCFCE7);

  static const warning = Color(0xFFF59E0B);
  static const warningDark = Color(0xFF92400E);
  static const warningBg = Color(0xFFFEF3C7);

  static const danger = Color(0xFFDC2626);
  static const dangerDark = Color(0xFF991B1B);
  static const dangerBg = Color(0xFFFEE2E2);

  static const neutral = Color(0xFF4338CA);
  static const neutralBg = Color(0xFFE0E7FF);

  static const inactiveBg = Color(0xFFE2E8F0);
  static const inactiveText = Color(0xFF475569);
}
