import 'package:flutter/material.dart';

import 'package:workforce_mobile/core/theme/app_colors.dart';
import 'package:workforce_mobile/core/utils/resource.dart';

/// Renders a [Resource]'s loading / error+retry / empty / data states in one
/// place, replacing the web client's repeated "one row spanning all columns"
/// loading/empty/error text with real, reusable widgets.
class ResourceView<T> extends StatelessWidget {
  const ResourceView({
    super.key,
    required this.resource,
    required this.builder,
    this.onRetry,
    this.isEmpty,
    this.emptyMessage = 'Nothing to show yet.',
    this.emptyIcon = Icons.inbox_outlined,
  });

  final Resource<T> resource;
  final Widget Function(BuildContext context, T data) builder;
  final VoidCallback? onRetry;
  final bool Function(T data)? isEmpty;
  final String emptyMessage;
  final IconData emptyIcon;

  @override
  Widget build(BuildContext context) {
    if (resource.isLoading && !resource.hasData) {
      return const Padding(
        padding: EdgeInsets.symmetric(vertical: 48),
        child: Center(child: CircularProgressIndicator()),
      );
    }

    if (resource.isFailure && !resource.hasData) {
      return _StateBlock(
        icon: Icons.error_outline,
        iconColor: AppColors.danger,
        message: resource.message ?? 'Something went wrong.',
        actionLabel: onRetry != null ? 'Try again' : null,
        onAction: onRetry,
      );
    }

    final data = resource.data;
    if (data == null) {
      return _StateBlock(icon: emptyIcon, message: emptyMessage);
    }

    if (isEmpty != null && isEmpty!(data)) {
      return _StateBlock(icon: emptyIcon, message: emptyMessage);
    }

    return builder(context, data);
  }
}

class _StateBlock extends StatelessWidget {
  const _StateBlock({
    required this.icon,
    required this.message,
    this.iconColor = AppColors.textFaint,
    this.actionLabel,
    this.onAction,
  });

  final IconData icon;
  final Color iconColor;
  final String message;
  final String? actionLabel;
  final VoidCallback? onAction;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 48, horizontal: 24),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          Icon(icon, size: 36, color: iconColor),
          const SizedBox(height: 12),
          Text(
            message,
            textAlign: TextAlign.center,
            style: const TextStyle(color: AppColors.textMuted, fontSize: 14),
          ),
          if (actionLabel != null) ...[
            const SizedBox(height: 16),
            OutlinedButton.icon(
              onPressed: onAction,
              icon: const Icon(Icons.refresh, size: 18),
              label: Text(actionLabel!),
            ),
          ],
        ],
      ),
    );
  }
}
