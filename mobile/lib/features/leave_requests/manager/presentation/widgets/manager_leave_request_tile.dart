import 'package:flutter/material.dart';
import 'package:workforce_mobile/core/theme/app_colors.dart';
import 'package:workforce_mobile/core/utils/formatters.dart';
import 'package:workforce_mobile/core/widgets/avatar_initials.dart';
import 'package:workforce_mobile/core/widgets/status_pill.dart';

import 'package:workforce_mobile/features/leave_requests/data/leave_request.dart';

class ManagerLeaveRequestTile extends StatefulWidget {
  const ManagerLeaveRequestTile({super.key, required this.request, required this.onReview});

  final LeaveRequest request;
  final Future<void> Function({required bool approve, required String note}) onReview;

  @override
  State<ManagerLeaveRequestTile> createState() => _ManagerLeaveRequestTileState();
}

class _ManagerLeaveRequestTileState extends State<ManagerLeaveRequestTile> {
  final _noteController = TextEditingController();
  bool _busy = false;

  @override
  void dispose() {
    _noteController.dispose();
    super.dispose();
  }

  Future<void> _handle(bool approve) async {
    setState(() => _busy = true);
    await widget.onReview(approve: approve, note: _noteController.text.trim());
    if (mounted) setState(() => _busy = false);
  }

  @override
  Widget build(BuildContext context) {
    final request = widget.request;
    final nameParts = (request.employeeName ?? '').split(' ');
    final initials = Formatters.initialsOf(
      nameParts.isNotEmpty ? nameParts.first : '',
      nameParts.length > 1 ? nameParts.last : '',
    );

    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                AvatarInitials(initials: initials, size: 32),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    Formatters.titleCase(request.employeeName ?? 'Unknown'),
                    style: const TextStyle(fontWeight: FontWeight.w700),
                  ),
                ),
                StatusPill.leaveType(request.leaveType),
                const SizedBox(width: 6),
                StatusPill.leaveStatus(request.status),
              ],
            ),
            const SizedBox(height: 8),
            Text(Formatters.dateRange(request.startDate, request.endDate)),
            if (request.reason.isNotEmpty) ...[
              const SizedBox(height: 4),
              Text(request.reason, style: const TextStyle(color: AppColors.textMuted)),
            ],
            const SizedBox(height: 10),
            if (request.isPending) ...[
              TextField(
                controller: _noteController,
                decoration: const InputDecoration(hintText: 'Add a note...'),
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: FilledButton(
                      style: FilledButton.styleFrom(backgroundColor: AppColors.success),
                      onPressed: _busy ? null : () => _handle(true),
                      child: const Text('Approve'),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: FilledButton(
                      style: FilledButton.styleFrom(backgroundColor: AppColors.danger),
                      onPressed: _busy ? null : () => _handle(false),
                      child: const Text('Reject'),
                    ),
                  ),
                ],
              ),
            ] else if (request.managerComment.isNotEmpty)
              Text(
                'Manager note: ${request.managerComment}',
                style: const TextStyle(color: AppColors.textFaint, fontStyle: FontStyle.italic),
              ),
          ],
        ),
      ),
    );
  }
}
